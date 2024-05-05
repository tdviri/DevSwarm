import React from 'react';
import '../stylesheets/App.css';
import axios from 'axios';
import {useState, useEffect} from 'react';

export default function UserTags(props) {
    const [isTagInUse, setIsTagInUse] = useState(false);

    function showTaggedQuestions(tagId){
        props.setSearch('');
        props.setCurrentTag(tagId);
        props.setShowUserProfile(false);
        props.setDisplayTagsPage(false);
    }

    async function editTag(tag){
        const resp = await axios.get('http://localhost:8000/api/retrievetags', {withCredentials: true});
        const appTags = resp.data;
        if (appTags.some(appTag => appTag.id === tag.id)){
            setIsTagInUse(true);
            return;
        }
        await axios.put('http://localhost:8000/api/edittag', {withCredentials: true});
    }

    async function deleteTag(tag){
        const resp = await axios.get('http://localhost:8000/api/retrievetags', {withCredentials: true});
        const appTags = resp.data;
        if (appTags.some(appTag => appTag.id === tag.id)){
            setIsTagInUse(true);
            return;
        }
        await axios.delete('http://localhost:8000/api/deletetag', tag, {withCredentials: true});
    }

  return (
    <div>
        <div className="tags-page-header">
            <div id="num-of-tags-header">{props.userTags && props.userTags.length} Tags</div>
            {/* {props.isLoggedIn && <div id="tags-page-ask-question-btn"><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>} */}
        </div>
        <div id="tags-container"> {props.userTags && props.userTags.map((tag)=>{
             if (tag.questionCount === 1){
                return <div key={tag._id} id="tag-container" className="tag-container">
                <div onClick={()=>showTaggedQuestions(tag._id)} id="tag-name" className="tag-name">{tag.name}</div>
                <span className="tag-num-of-questions">{tag.questionCount} question</span>
              </div>
             }
             else {
                 return <div key={tag._id} id="tag-container" className="tag-container">
                 <div onClick={()=>showTaggedQuestions(tag._id)} id="tag-name" className="tag-name">{tag.name}</div>
                 <span className="tag-num-of-questions">{tag.questionCount} questions</span>
                 <button className="edit-user-tag-btn" onClick={()=>editTag(tag)}>Edit</button>
                 <button className="delete-user-tag-btn" onClick={()=>deleteTag(tag)}>Delete</button>
                 {isTagInUse && <span>Cannot edit/delete tag because it's currently in use by other users.</span>}
               </div>
             }
        })}</div>
    </div>
  );
}