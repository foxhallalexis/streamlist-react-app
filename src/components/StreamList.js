import { useState } from 'react';
import "./StreamList.css";

function StreamList() {
    const [item, setItem] = useState('');
    const [list, setList] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item.trim() === '') return;
        
        console.log("User added:", item);
        setList([...list, item]);
        setItem('');
    };

    const handleDelete = (index) => {
        const updated = list.filter((_, i) => i !== index);
        setList(updated);
    }
    

    return (
        <div className="container streamlist-container">
            <h1 className="page-title">Your StreamList</h1>
            
            <form className="streamlist-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="Add a movie or show..."
                />
                <button type="submit">
                    <span className="material-symbols-rounded">add</span>
                </button>
            </form>

        <div className="streamlist-items">
            {list.length === 0 && (
                <p className="streamlist-empty">Your list is empty.</p>
            )}
            {list.map((item, index) => (
                <div key={index} className="card streamlist-card">
                    <p>{item}</p>
                    <button 
                        className="delete-btn"
                        onClick={() => handleDelete(index)}>
                        <span className="material-symbols-rounded">delete
                        </span>
                    </button>
                </div>
            ))}
        </div>
        </div>
    );
}

export default StreamList;