import React, { useState, useEffect } from 'react';
import '../stylesheets/App.css';
import axios from 'axios';
import NoTagsCreated from './noTagsCreated';

export default function UserTags(props) {
    const [isTagInUse, setIsTagInUse] = useState(false);
    const [editingTagId, setEditingTagId] = useState(null);
    const [newTagName, setNewTagName] = useState('');
    const [mapTags, setMapTags] = useState(null);
    const [tags, setTags] = useState(props.userTags);
    const [noUserTags, setNoUserTags] = useState(false);

    useEffect(()=>{
        console.log(tags)
        setNoUserTags(false);
        if (tags && tags.length > 0 && tags.every(tag => tag && typeof tag === 'object' && tag._id)) {
            createMapTags();
        } else {
            setNoUserTags(true);
        }
    }, [])

    function createMapTags(){
        const tagsArr = tags?.map((tag)=>{ 
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
    }

    function showTaggedQuestions(tagId) {
        props.setSearch('');
        props.setCurrentTag(tagId);
        props.setShowUserProfile(false);
        props.setDisplayTagsPage(false);
    }

    async function editTag(tag) {
            const resp = await axios.get('http://localhost:8000/api/retrievequestions', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const appQuestions = resp.data;
            let count = 0;
            appQuestions.forEach(appQuestion => {
                if (appQuestion.tags.includes(tag._id)){
                    count++;
                }
                if (count === 2){
                    setIsTagInUse(true);
                    setEditingTagId(null);
                    setNewTagName('');
                    props.fetchData();
                    return;
                }
            })
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
            const resp = await axios.get('http://localhost:8000/api/retrievequestions', { withCredentials: true });
            const appQuestions = resp.data;
            let count = 0;
            appQuestions.forEach(appQuestion => {
                if (appQuestion.tags.includes(tag._id)){
                    count++;
                }
                if (count === 2){
                    setIsTagInUse(true);
                    return;
                }
            })
            setIsTagInUse(false);
            await axios.delete('http://localhost:8000/api/deletetag', {data: { tagId: tag._id }, withCredentials: true});
            // props.fetchUserData();
            // setTags(props.userTags)
            // createMapTags();
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    }

    // return (
    //     <div>
    //         {!noUserTags ? <div className="tags-page-header">
    //             <div id="num-of-tags-header">{tags && tags.length} Tags</div>
    //         </div>
    //         <div id="tags-container">
    //             {mapTags && mapTags.map((tag) => (
    //                 <div key={tag._id} className="tag-container">
    //                     <div className="tag-name" onClick={() => !editingTagId && showTaggedQuestions(tag._id)}>
    //                         {editingTagId === tag._id  ? <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} /> : tag.name}
    //                     </div>
    //                     <span className="tag-num-of-questions">{tag.questionCount} {tag.questionCount === 1 ? 'question' : 'questions'}</span>
    //                     {!isTagInUse  && <div>
    //                         <button className="edit-user-tag-btn" onClick={() => editingTagId === tag._id ? editTag(tag) : setEditingTagId(tag._id)}>
    //                             {editingTagId === tag._id ? 'Save' : 'Edit'}
    //                         </button>
    //                     <button className="delete-user-tag-btn" onClick={() => deleteTag(tag)}>Delete</button></div>}
    //                     {isTagInUse && <span>Cannot edit/delete tag because it's currently in use by other users.</span>}
    //                 </div>
    //             ))}
    //         </div> : <NoTagsCreated/>}
    //     </div>
    // );
    return (
        <div>
            {!noUserTags ? (
                <>
                    <div className="tags-page-header">
                        <div id="num-of-tags-header">{tags && tags.length} Tags</div>
                    </div>
                    <div id="tags-container">
                        {mapTags && mapTags.map((tag) => (
                            <div key={tag._id} className="tag-container">
                                <div className="tag-name" onClick={() => !editingTagId && showTaggedQuestions(tag._id)}>
                                    {editingTagId === tag._id ? (
                                        <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                                    ) : (
                                        tag.name
                                    )}
                                </div>
                                <span className="tag-num-of-questions">{tag.questionCount} {tag.questionCount === 1 ? 'question' : 'questions'}</span>
                                {!isTagInUse && (
                                    <div>
                                        <button className="edit-user-tag-btn" onClick={() => editingTagId === tag._id ? editTag(tag) : setEditingTagId(tag._id)}>
                                            {editingTagId === tag._id ? 'Save' : 'Edit'}
                                        </button>
                                        <button className="delete-user-tag-btn" onClick={() => deleteTag(tag)}>Delete</button>
                                    </div>
                                )}
                                {isTagInUse && <span>Cannot edit/delete tag because it's currently in use by other users.</span>}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <NoTagsCreated/>
            )}
        </div>
    );
    
}