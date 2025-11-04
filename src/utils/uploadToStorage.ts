import { supabase } from "@/integrations/supabase/client";

export async function uploadImageToStorage(file: File, folder: string = "icons"): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('pluto-hub-assets')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('pluto-hub-assets')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
