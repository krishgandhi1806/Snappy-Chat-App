import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
function ChatInput({handleSendMsg}) {

    const [showEmojiPicker, setShowEmojiPicker]= useState(false);
    const [msg, setMsg]= useState("");

    const handleEmojiPickerHideShow= ()=>{
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick= (emoji)=>{
        // console.log(emoji.emoji);
        let message= msg;
        message +=emoji.emoji;
        setMsg(message);
    }

    const sendChat= (e)=>{
        e.preventDefault();
        if(msg.length>0){
            handleSendMsg(msg);
            setMsg("");
        }
    }


    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}></BsEmojiSmileFill>
                    {
                        showEmojiPicker && <Picker className="emoji-picker-react" onEmojiClick={handleEmojiClick}></Picker>
                    }
                </div>
            </div>
            <form className="input-container" onSubmit={(e)=>sendChat(e)}>
                <input type="text" placeholder="Type your message here" value={msg} onChange={(e)=>{
                    // console.log(e.target.value);

                    setMsg(e.target.value.replace(/\d/g, "*"));
                }} />
                <button className="submit">
                    <IoMdSend></IoMdSend></button>
            </form>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color: #080420;
    /* padding: 1rem; */
    padding-bottom: 0.3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    .button-container{
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;
        .emoji{
            position: relative;
            svg{
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }
            .EmojiPickerReact{
                position: absolute;
                top: -500px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9186f3;
                .epr-body::-webkit-scrollbar{
                    background-color: #080420;
                    width: 5px;
                    &-thumb {
                        background-color: #9186f3;
                    }
                }
                .EmojiCategories{
                    button{
                        filter: contrast(0);
                    }
                }
                .epr-emoji-category-label, .epr-search{
                    background-color: transparent;
                    border-color: #9186f3;
                }
                .emoji-group:before{
                    background-color: #080420;
                }

                .epr-btn{
                    /* display: none; */
                }
            }
        }
    }

    .input-container{
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        /* padding-bottom: 0.5rem; */
        gap: 2rem;
        background-color: #ffffff34;
        input{
            width: 90%;
            height: 60%;
            background-color: transparent;
            color: white;
            border: none;
            padding: 0.5rem;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection{
                background-color: #9a86f3 ;
            }
            &:focus{
                outline: none;
            }
        }
        button{
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border:none;
            svg{
                color: white;
                font-size: 1.5rem;
            }
        }
    }
`;

export default ChatInput
