package com.opencbs.bonds.services;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.ExchangeRateRepository;
import com.opencbs.core.services.AbstractExchangeRateService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.HolidayService;
import lombok.NonNull;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class DefaultExchangeRateService extends AbstractExchangeRateService {

    public static final String EURO_CURRENCY = "EUR";

    @Autowired
    public DefaultExchangeRateService(@NonNull CurrencyService currencyService,
                                        @NonNull ExchangeRateRepository exchangeRateRepository,
                                        @NonNull HolidayService holidayService) {
        super(currencyService, exchangeRateRepository, holidayService);
    }

    @Override
    /// TODO settings need from property file
    @Scheduled(cron = "0 2 16 * * MON-FRI", zone = "CET")
    public void getCurrencies() throws Exception {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();

        org.jsoup.nodes.Document jsoupDocument = Jsoup.connect("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml").get();
        Document document = documentBuilder.parse(new InputSource(new StringReader(jsoupDocument.html())));

        Currency euro = this.currencyService.getCurrencyByName("EUR").get();
        processingExchangeRate(document, euro);
    }

    public void updateCurrencies() throws Exception {
        Optional<Currency> optionalCurrency = this.currencyService.getCurrencyByName(EURO_CURRENCY);
        if (!optionalCurrency.isPresent()) {
            throw new ResourceNotFoundException(String.format("Not found currency with code: %s", EURO_CURRENCY));
        }

        Currency euro = optionalCurrency.get();
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();

        org.jsoup.nodes.Document jsoupDocument = Jsoup.connect("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml").get();
        Document document = documentBuilder.parse(new InputSource(new StringReader(jsoupDocument.html())));

        processingExchangeRate(document, euro);
    }

    private void processingExchangeRate(Document document, Currency euro) {
        NodeList allNodes = document.getChildNodes().item(0).getChildNodes();
        for (int i = 0; i < allNodes.getLength(); i++) {
            Node node = allNodes.item(i);
            if (node.getNodeName() != "Cube")
                continue;
            this.getChildNodes(node, euro);
        }
    }

    private void getChildNodes(Node node, Currency euro) {
        NodeList childNodes = node.getChildNodes();
        for (int j = 0; j < childNodes.getLength(); j++) {
            Node dateNode = childNodes.item(j);
            if (!dateNode.hasAttributes())
                continue;

            Element dateElement = (Element) dateNode;
            String dateString = dateElement.getAttribute("time");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate date = LocalDate.parse(dateString, formatter);
            this.getCurrencyNodes(dateElement, date, euro);
        }
    }

    private void getCurrencyNodes(Element dateElement, LocalDate date, Currency euro) {
        NodeList currenciesNodes = dateElement.getChildNodes();
        for (int k = 0; k < currenciesNodes.getLength(); k++) {
            Node currencyNode = currenciesNodes.item(k);
            if (currencyNode instanceof Element){
                Element currencyElement = (Element) currencyNode;
                this.createRate(currencyElement, date, euro);
            }
        }
    }
}