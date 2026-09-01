import { IoAdd } from "react-icons/io5";

export default function ImageUpload(){
    
    // async function uploadImage(e){
    //     const file = e.target.files[0];
    
    //     if (!file) {
    //         console.error('No image was uploaded');
    //         return;
    //     }

    //     const fileName = `avatar-${session.user.id}`;

    //     try {
    //         setUploading(true);
    //         // 3. Upload the file to your specific bucket
    //         const { data, error } = await supabase.storage
    //         .from('avatars')
    //         .upload(fileName, file, {
    //             cacheControl: '3600',
    //             upsert: true,
    //             contentType: file.type // Ensures correct MIME type handling
    //         });

    //         if (error) {
    //             throw error;
    //         }

    //         console.log('Upload successful! File details:', data);

    //         // 4. (Optional) Get the public URL if your bucket is public
    //         const { data: publicUrlData } = supabase.storage
    //         .from('avatars')
    //         .getPublicUrl(fileName);
            
    //         console.log('Public URL:', publicUrlData.publicUrl);

    //         const { error: updateError } = await supabase
    //         .from('users')
    //         .update({ 
    //             avatar: `${publicUrlData.publicUrl}?t=${Date.now()}`
    //         })
    //         .eq('id', userId);

    //         if(updateError) {throw updateError;}
    //         setAvatar(publicUrlData.publicUrl);
    //         setUploadError("Success");
    //         setUploading(false);

    //     } catch (error) {
    //         setUploading(false);
    //         setUploadError(error.message);
    //         console.error('Error uploading image:', error.message);
    //     }
    // }

    return (
        <div>
            <label className="labelButton" htmlFor="newFeatured"><IoAdd /></label>
            <input type="file" className="hide" id="newFeatured" />
        </div>
    );
}