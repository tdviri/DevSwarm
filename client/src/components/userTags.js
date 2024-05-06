import React, { useState, useEffect } from 'react';
import '../stylesheets/App.css';
import axios from 'axios';

export default function UserTags(props) {
    const [isTagInUse, setIsTagInUse] = useState(false);
    const [editingTagId, setEditingTagId] = useState(null);
    const [newTagName, setNewTagName] = useState('');
    const [mapTags, setMapTags] = useState(null);

    useEffect(()=>{
        const tagsArr = props.userTags?.map((tag)=>{ 
            return {
                ...tag,
                questionCount: props.questions.filter((question)=>{
                return question.tags.includes(tag._id);
            }).length
            }
        })
        const uniqueTagsArr = tagsArr.filter((tag, index, self) => {
            return index === self.findIndex((t) => (
                t._id === tag._id
            ));
        })
        setMapTags(uniqueTagsArr);
    }, [])

    function showTaggedQuestions(tagId) {
        props.setSearch('');
        props.setCurrentTag(tagId);
        props.setShowUserProfile(false);
        props.setDisplayTagsPage(false);
    }

    async function editTag(tag) {
            const resp = await axios.get('http://localhost:8000/api/retrievetags', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const appTags = resp.data;
            if (appTags.some(appTag => appTag.name === tag.name)) {
                setIsTagInUse(true);
                setEditingTagId(null);
                setNewTagName('');
                props.fetchData();
                return;
            }
            setIsTagInUse(false);
            await axios.put('http://localhost:8000/api/edittag', { id: tag._id, name: newTagName }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const newTagsArr = mapTags.map(newTag => {
                if (newTag._id === tag._id) {
                    return { ...newTag, name: newTagName };
                } else {
                    return newTag;
                }
            });
            setMapTags(newTagsArr);
            setEditingTagId(null);
            setNewTagName('');
            props.fetchData();
    }

    async function deleteTag(tag) {
        try {
            const resp = await axios.get('http://localhost:8000/api/retrievetags', { withCredentials: true });
            const appTags = resp.data;
            if (appTags.some(appTag => appTag.name === tag.name)) {
                setIsTagInUse(true);
                return;
            }
            setIsTagInUse(false);
            await axios.delete(`http://localhost:8000/api/deletetag`, { withCredentials: true, data: tag._id });
            props.fetchData();
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    }

    return (
        <div>
            <div className="tags-page-header">
                <div id="num-of-tags-header">{props.userTags && props.userTags.length} Tags</div>
            </div>
            <div id="tags-container">
                {mapTags && mapTags.map((tag) => (
                    <div key={tag._id} className="tag-container">
                        <div className="tag-name" onClick={() => !editingTagId && showTaggedQuestions(tag._id)}>
                            {editingTagId === tag._id  ? <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} /> : tag.name}
                        </div>
                        <span className="tag-num-of-questions">{tag.questionCount} {tag.questionCount === 1 ? 'question' : 'questions'}</span>
                        {!isTagInUse  && <div>
                            <button className="edit-user-tag-btn" onClick={() => editingTagId === tag._id ? editTag(tag) : setEditingTagId(tag._id)}>
                                {editingTagId === tag._id ? 'Save' : 'Edit'}
                            </button>
                        <button className="delete-user-tag-btn" onClick={() => deleteTag(tag)}>Delete</button></div>}
                        {isTagInUse && <span>Cannot edit/delete tag because it's currently in use by other users.</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}