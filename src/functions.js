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
    .eq('authId', id);

    if(error){
        console.error(error);
        return null;
    }

    return data[0];
}

export async function followerCount(authId){
    const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('following', authId);

    if(error){
        console.error(error);
        return 0;
    }

    return data.length;
}

export async function followingCount(authId){
    const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower', authId);

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
    const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq("follower", follower)
    .eq("following", following)
    .maybeSingle();

    if(error){
        console.error(error);
        return false;
    }

    // console.log(data);
    return data ? true : false;
}