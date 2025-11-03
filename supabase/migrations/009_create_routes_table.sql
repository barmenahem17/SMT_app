-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  route_type TEXT NOT NULL CHECK (route_type IN ('morning', 'afternoon')),
  is_permanent BOOLEAN NOT NULL DEFAULT true,
  active_days JSONB NOT NULL DEFAULT '["weekdays"]'::jsonb,
  children JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on route_type for faster queries
CREATE INDEX IF NOT EXISTS idx_routes_route_type ON routes(route_type);

-- Create index on is_permanent for faster queries
CREATE INDEX IF NOT EXISTS idx_routes_is_permanent ON routes(is_permanent);

-- Add RLS (Row Level Security) policies
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (you can restrict later based on authentication)
CREATE POLICY "Allow all operations on routes" ON routes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

