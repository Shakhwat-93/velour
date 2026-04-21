ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::JSONB;

-- Add size column to order items if it doesn't exist (assuming order items are stored in a JSONB column in orders table or a separate table)
-- If orders table has an 'items' JSONB column:
-- No changes needed to table structure, but we'll update the application logic.

-- If there is an order_items table:
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;
