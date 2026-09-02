import { useEffect, useState } from "react";

export function TabLayout(params){
    const {tabs} = params;
    const [selected, setSelected] = useState(0);

    return (
        <div>
            <div style={{
                width:"100%",
                display:"grid",
                gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
                gap:"20px",
                textAlign:"center",
                marginBottom:"0px",
            }}>
                {tabs.map((tab, index) => (
                    <Tab 
                        text={tab.title} 
                        selected={selected == index} 
                        index={index} 
                        setSelected={setSelected} 
                        key={index} 
                    />
                ))}
            </div>
            <div>
                {tabs.map((tab, index) => (
                    <div 
                        className={selected == index ? "" : "hide"}
                        key={index}
                        style={{
                            margin:"5px"
                        }}
                    >
                        {tab.element}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Tab(params){
    const {text, selected, index, setSelected} = params;

    return(
        <div 
        style={{
            width:"100%",
            justifyItems:"center",
            fontSize:"auto",
            cursor:"pointer",
        }}
        onClick={() => setSelected(index)}
        >
            <div style={{
                width:"50px",
                borderBottom: selected ? "1px solid var(--accent)" : "",
                paddingBottom:"10px",
                color: selected ? "var(--accent" : "grey",
                fontSize:"1.2rem"
            }}>
                {text}
            </div>
        </div>
    )
}