import { supabase } from "../supabaseClient";

export function changePage(page, navigate){
    navigate(page);
    window.location.reload();
}

export async function getSession(){
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getUser(id){
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', id);

    if(error){
        console.error(error);
        return null;
    }

    return data[0];
}

export async function followerCount(auth_id){
    const { data, error } = await supabase.rpc('follower_count', { user_id: auth_id })

    if(error){
        console.error(error);
        return 0;
    }

    return data;
}

export async function followingCount(auth_id){
    const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower', auth_id);

    if(error){
        console.error(error);
        return 0;
    }

    return data.length;
}

export async function follow(follower, following, updateCounts){
    const isf = await isFollowing(follower, following);

    if(isf){
        const {error} = await supabase
        .from('follows')
        .delete()
        .eq('follower', follower)
        .eq("following", following);

        if(error){
            console.error(error);
            return;
        }
    }else{
        const {error} = await supabase
        .from('follows')
        .insert({follower: follower, following: following})

        if(error){
            console.error(error);
            return;
        }
    }

    updateCounts();
}

export async function isFollowing(follower, following){    
    const { data, error } = await supabase.rpc('is_following', { 
        user_one: follower,
        user_two: following
    })

    if(error){
        console.error(error);
        return false;
    }

    return data;
}

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1 // Adjust decimal places as needed
});
const formatter_over10k = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 0 // Adjust decimal places as needed
});

export function formatNumber(num){
    return num > 9999 ? 
    num > 99999 ?
    formatter_over10k.format(num)
    :
    formatter.format(num) 
    : num;
}

export async function getArtworks(id){
    const { data, error } = await supabase.rpc('get_artworks', { 
        auth_id: id
    })

    if(error){
        console.error(error);
        return [];
    }

    if(!data) return [];
    return data;
}