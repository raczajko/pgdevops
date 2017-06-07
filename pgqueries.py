connection_query = """WITH act_base as (
                    SELECT unnest(ARRAY['idle','active','idle_in_transaction']) as "state" )
                    SELECT ab.state, count(sa.state)
                    FROM act_base ab LEFT OUTER JOIN pg_stat_activity sa ON ab.state = sa.state
                    GROUP BY ab.state
                    UNION ALL
                    SELECT 'total', count(1) FROM pg_stat_activity
                    UNION ALL
                    SELECT 'max', setting::bigint FROM pg_settings WHERE name='max_connections'"""