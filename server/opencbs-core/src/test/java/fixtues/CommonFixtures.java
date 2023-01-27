package fixtues;

import java.time.LocalDateTime;
import java.time.Month;

public class CommonFixtures {
    static LocalDateTime getLocalDateTime() {
        return LocalDateTime.of(2011, Month.APRIL, 11, 10, 10, 10);
    }
}
