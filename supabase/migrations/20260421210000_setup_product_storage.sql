-- Create the products bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to view images in the products bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Read Access'
    ) THEN
        CREATE POLICY "Public Read Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'products');
    END IF;
END $$;

-- Policy: Allow authenticated users to upload images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Admin Upload Access'
    ) THEN
        CREATE POLICY "Admin Upload Access"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'products');
    END IF;
END $$;

-- Policy: Allow authenticated users to update/delete images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Admin Manage Access'
    ) THEN
        CREATE POLICY "Admin Manage Access"
        ON storage.objects FOR ALL
        TO authenticated
        USING (bucket_id = 'products');
    END IF;
END $$;
