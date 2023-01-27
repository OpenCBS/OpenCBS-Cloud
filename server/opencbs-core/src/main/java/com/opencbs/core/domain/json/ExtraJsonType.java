package com.opencbs.core.domain.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.usertype.UserType;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.io.StringWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class ExtraJsonType implements UserType {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public int[] sqlTypes() {
        return new int[]{Types.JAVA_OBJECT};
    }

    @Override
    public Class<ExtraJson> returnedClass() {
        return ExtraJson.class;
    }

    @Override
    public Object nullSafeGet(final ResultSet rs, final String[] names, final SessionImplementor session,
                              final Object owner) throws HibernateException, SQLException {
        final String cellContent = rs.getString(names[0]);
        if (cellContent == null) {
            return null;
        }
        try {
            return mapper.readValue(cellContent.getBytes("UTF-8"), returnedClass());
        } catch (final Exception ex) {
            throw new RuntimeException("Failed to convert String to Json: " + ex.getMessage(), ex);
        }
    }

    @Override
    public void nullSafeSet(final PreparedStatement ps, final Object value, final int idx,
                            final SessionImplementor session) throws HibernateException, SQLException {
        if (value == null) {
            ps.setNull(idx, Types.OTHER);
            return;
        }
        try {
            final StringWriter stringWriter = new StringWriter();
            mapper.writeValue(stringWriter, value);
            stringWriter.flush();
            ps.setObject(idx, stringWriter.toString(), Types.OTHER);
        } catch (final Exception ex) {
            throw new RuntimeException("Failed to convert Json to String: " + ex.getMessage(), ex);
        }
    }

    @Override
    public Object deepCopy(final Object value) throws HibernateException {
        try {
            // use serialization to create a deep copy
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
            objectOutputStream.writeObject(value);
            objectOutputStream.flush();
            objectOutputStream.close();
            byteArrayOutputStream.close();

            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            return new ObjectInputStream(byteArrayInputStream).readObject();
        } catch (ClassNotFoundException | IOException ex) {
            throw new HibernateException(ex);
        }
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(final Object value) throws HibernateException {
        return (Serializable) this.deepCopy(value);
    }

    @Override
    public Object assemble(final Serializable cached, final Object owner) throws HibernateException {
        return this.deepCopy(cached);
    }

    @Override
    public Object replace(final Object original, final Object target, final Object owner) throws HibernateException {
        return this.deepCopy(original);
    }

    @Override
    public boolean equals(final Object obj1, final Object obj2) throws HibernateException {
        if (obj1 == null) {
            return obj2 == null;
        }
        return obj1.equals(obj2);
    }

    @Override
    public int hashCode(final Object obj) throws HibernateException {
        return obj.hashCode();
    }

}

