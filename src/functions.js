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