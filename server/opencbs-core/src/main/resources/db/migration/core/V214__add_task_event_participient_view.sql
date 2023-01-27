DROP VIEW IF EXISTS view_task_event_participants;
CREATE VIEW view_task_event_participants
  AS
    SELECT
      row_number() OVER ( ORDER BY participant_id ) id, result.*
    FROM
      (
        SELECT
          p.id as participant_id,
          p.name as name,
          FALSE is_user
        FROM profiles p
        UNION ALL
        SELECT
          u.id as participant_id,
          concat(u.first_name,u.last_name) as name,
          TRUE is_user
        FROM users u
        WHERE u.is_system_user = FALSE
      ) result;