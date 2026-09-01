import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Tags(params){
    const {tags, setTags} = params;
    const [newTag, setNewTag] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault(); // Stops the comma from typing out
            if(tags.length >= 5) return;
            
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
                    <Tag text={value} key={index} tags={tags} setTags={setTags} index={index} />
                ))}
            </div>
        </div>
    );
}

function Tag(params){
    const {text, tags, setTags, index} = params;

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
            <IoCloseOutline style={{cursor:"pointer"}} onClick={() => {
                setTags(tags.toSpliced(index, 1));
            }}/>
        </div>  
    );
}