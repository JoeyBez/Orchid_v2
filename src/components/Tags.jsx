import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Tags(params){
    const {tags, setTags, max} = params;
    const [newTag, setNewTag] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault(); // Stops the comma from typing out
            if(tags.length >= max) return;

            const trimmedValue = newTag.trim();
            if (trimmedValue) {
                setTags([...tags, trimmedValue]);
                setNewTag(''); // Clear the input
            }
            
        }
    };

    return(
        <div style={{width:"100%"}}>
            <input className="formInput" 
                style={{width:"100%"}} 
                placeholder="Enter tag..." 
                onKeyDown={handleKeyDown}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
            />
            <br />
            <br />
            <div style={{
                display:"flex",
                gap:"10px",
                flexWrap:"wrap"
            }}>
                {tags.map((value, index) => (
                    <Tag text={value} key={index} tags={tags} setTags={setTags} index={index} removable={true} />
                ))}
            </div>
        </div>
    );
}

export function Tag(params){
    const {text, tags, setTags, index, removable} = params;

    return(
        <div style={{
            display:"flex",
            backgroundColor: "var(--tag-bg)",
            borderRadius: "var(--border-radius)",
            width: "fit-content",
            padding: "var(--tag-padding)",
            gap: "5px"
        }}>
            <small>{text || ""}</small>
            {removable && <IoCloseOutline style={{cursor:"pointer"}} onClick={() => {
                setTags(tags.toSpliced(index, 1));
            }}/>}
        </div>  
    );
}