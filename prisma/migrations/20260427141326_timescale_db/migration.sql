-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert consumption table into a TimescaleDB hypertable
SELECT create_hypertable ('consumption', 'timestamp', create_default_indexes => false);