-- Drop all dependent tables first to avoid foreign key conflicts
DROP TABLE IF EXISTS ITEM_SPLIT CASCADE;
DROP TABLE IF EXISTS BILL_MEMBERS CASCADE;
DROP TABLE IF EXISTS BILL_ITEMS CASCADE;
DROP TABLE IF EXISTS BILLS CASCADE;

-- Drop the enum type if it exists
DROP TYPE IF EXISTS SPLIT_TYPE CASCADE;

-- Recreate the enum type
CREATE TYPE SPLIT_TYPE AS ENUM ('AMOUNT', 'PERCENTAGE', 'SHARE', 'EQUAL');

-- Recreate the BILLS table with the owner_id column
CREATE TABLE BILLS (
    id UUID DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    currency VARCHAR(3) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_bills PRIMARY KEY (id)
);

-- Recreate the BILL_MEMBERS table
CREATE TABLE BILL_MEMBERS (
    id UUID,
    bill_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    color_code VARCHAR(7),
    CONSTRAINT pk_members PRIMARY KEY (id),
    CONSTRAINT fk_members_bill FOREIGN KEY (bill_id) REFERENCES BILLS(id) ON DELETE CASCADE
);

-- Recreate the BILL_ITEMS table
CREATE TABLE BILL_ITEMS (
    id UUID DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    quantity NUMERIC(12) NOT NULL,
    split_type SPLIT_TYPE NOT NULL DEFAULT 'EQUAL',
    CONSTRAINT pk_bill_items PRIMARY KEY (id),
    CONSTRAINT fk_bill_items_bill FOREIGN KEY (bill_id) REFERENCES BILLS(id) ON DELETE CASCADE
);

-- Recreate the ITEM_SPLIT table
CREATE TABLE ITEM_SPLITS (
    id UUID DEFAULT gen_random_uuid(),
    bill_item_id UUID NOT NULL,
    assignee_id UUID NOT NULL,
    split_value NUMERIC(12,2) NOT NULL,
    CONSTRAINT pk_split PRIMARY KEY (id),
    CONSTRAINT fk_split_bill_item FOREIGN KEY (bill_item_id) REFERENCES BILL_ITEMS(id) ON DELETE CASCADE,
    CONSTRAINT fk_split_assignee FOREIGN KEY (assignee_id) REFERENCES BILL_MEMBERS(id) ON DELETE CASCADE
);

-- Recreate indexes
CREATE INDEX idx_bill_items_bill_id ON BILL_ITEMS(bill_id);
CREATE INDEX idx_bill_members_bill_id ON BILL_MEMBERS(bill_id);
CREATE INDEX idx_item_split_bill_item_id ON ITEM_SPLITS(bill_item_id);
CREATE INDEX idx_item_split_assignee_id ON ITEM_SPLITS(assignee_id);
