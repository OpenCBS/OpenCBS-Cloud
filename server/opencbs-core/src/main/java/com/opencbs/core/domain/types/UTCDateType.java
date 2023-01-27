package com.opencbs.core.domain.types;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.*;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class UTCDateType implements UserType {

    protected static int[] SQL_TYPES_UTC = {Types.TIMESTAMP};

    @Override
    public int[] sqlTypes() {
        return SQL_TYPES_UTC;
    }

    protected Calendar sUTCCalendar = Calendar.getInstance();

    {
        sUTCCalendar.setTimeZone(TimeZone.getTimeZone("UTC"));
    }


    @Override
    public boolean equals(Object x, Object y) {
        return (x == null) ? (y == null) : x.equals(y);
    }

    @Override
    public boolean isMutable() {
        return true;
    }


    @Override
    public Class<?> returnedClass() {
        return Date.class;
    }

    @Override
    public Object deepCopy(Object value) {
        return (value == null) ? null : (Date) value;
    }

    @Override
    public Object assemble(Serializable cached, Object owner) throws HibernateException {
        return deepCopy(cached);
    }

    @Override
    public Serializable disassemble(Object value) throws HibernateException {
        return (Serializable) deepCopy(value);
    }

    @Override
    public int hashCode(Object x) throws HibernateException {
        return x.hashCode();
    }

    @Override
    public Object nullSafeGet(ResultSet rs, String[] names, SessionImplementor session, Object owner) throws HibernateException, SQLException {
        try {
            if (rs.getDate(names[0]) == null)
                return null;
        } catch (Exception e) {
            return null;
        }

        return new Date(rs.getTimestamp(names[0], sUTCCalendar).getTime());
    }

    @Override
    public void nullSafeSet(PreparedStatement st, Object value, int index, SessionImplementor session) throws HibernateException, SQLException {
        if (null == value) {
            st.setTimestamp(index, null);
            return;
        }
        Date dateValue = (Date) value;
        Timestamp timestamp = new Timestamp(dateValue.getTime());

        st.setTimestamp(index,
                timestamp,
                sUTCCalendar);
    }

    @Override
    public Object replace(Object original, Object target, Object owner) throws HibernateException {
        return deepCopy(original);
    }
}