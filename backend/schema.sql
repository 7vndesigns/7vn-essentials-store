CREATE TABLE IF NOT EXISTS catalog (
 id TEXT PRIMARY KEY,
 supplier_sku TEXT,
 name TEXT NOT NULL,
 case_description TEXT,
 supplier_cost_cents INTEGER,
 retail_price_cents INTEGER,
 currency TEXT NOT NULL DEFAULT 'USD',
 available INTEGER NOT NULL DEFAULT 0,
 stock_quantity INTEGER,
 verified_at TEXT,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS supplier_syncs (
 id TEXT PRIMARY KEY,
 adapter TEXT NOT NULL,
 status TEXT NOT NULL,
 details TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY,
 payment_reference TEXT UNIQUE,
 supplier_order_id TEXT UNIQUE,
 status TEXT NOT NULL DEFAULT 'pending_review',
 total_cents INTEGER,
 currency TEXT NOT NULL DEFAULT 'USD',
 payload_json TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS fulfillment_events (
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL,
 status TEXT NOT NULL,
 tracking_reference TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
