import React, { useState, useRef, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './style/TextEditor.scss';
import { EditorState, convertToRaw, Modifier, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
//import createEmojiPlugin from 'draft-js-emoji-plugin';
import SuggestionList from './SuggestionList';
import emojiIcon from '../../../assets/SVG/emoji.svg';
import undoIcon from '../../../assets/SVG/undo.svg';
import redoIcon from '../../../assets/SVG/redo.svg';
import boldIcon from '../../../assets/SVG/bold.svg';
import italicIcon from '../../../assets/SVG/italic.svg';
import underlineIcon from '../../../assets/SVG/underline.svg';
import Button from '../../formComponents/Button';

// .. Editor Suggestions List..
const spinTax = ['Hi', 'Hello', 'Dear', 'Hey', 'Greetings', 'Welcome'];
const mergeField = ['name', 'age', 'country', 'tier', 'status'];
const segment = ['Regards', 'Sincerely', 'Faithfully'];


// .. Plugin of Emoji..
//const emojiPlugin = createEmojiPlugin();
//const { EmojiSuggestions, EmojiSelect } = emojiPlugin;


const TextEditor = ({
    isEditing,
    setIsEditing,
    activeParentItem,
    saveMessage,
    activeMessage,
    useForModal = false,
    noSegment = false,
    handleCloseModal,
    setActiveMessage,
    setIsEditingMessage,
    message,
    setMessage,
    setTextContent //to save in parent
}) => {
    // const [editorState, setEditorState] = useState(() => message ? EditorState.createWithContent(convertFromRaw(JSON.parse(message))) : EditorState.createEmpty());
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMergeSugggestions, setShowMergeSuggestions] = useState(false);
    const [showSegmentSuggestions, setShowSegmentSuggestions] = useState(false);
    const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
    const editorRef = useRef(null);
    const [activeMessageParent, setActiveMessageParent] = useState(null);


    /**
     *  ==== Converting the editor state to HTML ====
     * @param editorState
     * @returns {string}
     */
    function convertEditorContentToHtml(editorState) {
        const contentState = editorState.getCurrentContent();
        const blocks = contentState.getBlockMap();

        let result = "";

        blocks.forEach(block => {
            const text = block.getText();
            const inlineStyleRanges = block.getInlineStyleAt(0); // Assuming inline styles start at offset 0

            let formattedText = text;

            inlineStyleRanges.forEach((style, offset) => {
                if (style.has("BOLD")) {
                    formattedText = formattedText.slice(0, offset) + `<strong>${formattedText.slice(offset)}`;
                }
                if (style.has("ITALIC")) {
                    formattedText = formattedText.slice(0, offset) + `<em>${formattedText.slice(offset)}`;
                }
                if (style.has("UNDERLINE")) {
                    formattedText = formattedText.slice(0, offset) + `<u>${formattedText.slice(offset)}`;
                }
            });

            result += formattedText + "<br />"; // Add a line break between blocks
        });

        return result;
    }


    /**
     * ==== The Toolbar Options ====
     */
    const toolbarOptions = {
        options: ['emoji', 'history', 'inline'],
       // emoji: { icon: emojiIcon, className: 'emoji-icon', component: EmojiSelect },
        history: {
            options: ['undo', 'redo', 'separator'],
            undo: { icon: undoIcon, className: undefined },
            redo: { icon: redoIcon, className: undefined },
        },
        inline: {
            options: ['bold', 'italic', 'underline'],
            bold: { icon: boldIcon, className: undefined },
            italic: { icon: italicIcon, className: undefined },
            underline: { icon: underlineIcon, className: undefined },
        },
    };


    /**
     * ==== Handle Editor Change =====
     * @param {*} state
     */
    const handleEditorChange = (state) => {
        const contentState = state.getCurrentContent();
        const selection = state.getSelection();
        const currentBlock = contentState.getBlockForKey(selection.getStartKey());
        const currentText = currentBlock.getText();
        const currentOffset = selection.getStartOffset();
        const currentChar = currentText.charAt(currentOffset - 1);


        //  //  console.log("comming::::::")
        //   const selection = window.getSelection();
        //   const range = selection.getRangeAt(0);
        //   const { top, left, height } = range.getBoundingClientRect();

        //   // Calculate the position of the popup
        //   const caretPosition = {
        //     top: top + height,
        //     left: left + 1,
        //   };

        //   setSuggestionPosition(caretPosition);


        // Check if the current character is an opening '{'
        // if (currentChar === '{') {
        //   setShowSuggestions(true);
        // } else {
        //   setShowSuggestions(false);
        // }

        // Update the editor state
        setEditorState(state);
        setTextContent(state)

        let differenceWithSingleBracket = false;

        // Check if the current charecter is two opening curly bracs '{{'..
        if (currentText.slice(currentOffset - 2, currentOffset) === '{{') {
            setShowSuggestions(false);
            setShowSegmentSuggestions(false);
            setShowMergeSuggestions(true);
            differenceWithSingleBracket = true;

        } else if (currentChar === '[' && !noSegment) {
            setShowSuggestions(false);
            setShowMergeSuggestions(false);
            setShowSegmentSuggestions(true);

        } else if (currentChar === '{') {
            setShowSuggestions(true);
            setShowMergeSuggestions(false);
            setShowSegmentSuggestions(false);
            differenceWithSingleBracket = false;
        } else {
            setShowSuggestions(false);
            setShowMergeSuggestions(false);
            setShowSegmentSuggestions(false);
        }


        // Check if the current character is an opening '{{' and if the suggestion list is shown
        if (currentText.slice(currentOffset - 2, currentOffset) === '{{' && showMergeSugggestions && differenceWithSingleBracket) {
            // Automatically add '}' after inserting suggestion
            const newContentState = state.getCurrentContent();
            const newSelection = selection.merge({
                anchorOffset: currentOffset + 2,
                focusOffset: currentOffset + 2,

            });

            const newContentStateWithClosingBracket = Modifier.insertText(
                newContentState,
                newSelection,
                '}}'
            );

            const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
            setEditorState(newEditorState);
            setTextContent(newEditorState)

        }

        // Check if the current character is an opening '{' and if the suggestion list is shown
        if (currentChar === '{' && showSuggestions && !differenceWithSingleBracket) {
            const newContentState = state.getCurrentContent();
            const newSelection = selection.merge({
                anchorOffset: currentOffset + 1,
                focusOffset: currentOffset + 1,
            });

            const newContentStateWithClosingBracket = Modifier.insertText(
                newContentState,
                newSelection,
                '}'
            );

            const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
            setEditorState(newEditorState);
            setTextContent(newEditorState)
        }

        // Check is the current character is with '|'..
        if (currentChar === '|') {
            setShowSuggestions(true);

            const newContentState = state.getCurrentContent();
            const newSelection = selection.merge({
                anchorOffset: currentOffset,
                focusOffset: currentOffset,
            });

            const newContentStateWithIndex = Modifier.insertText(newContentState, newSelection);
            const newEditorState = EditorState.push(state, newContentStateWithIndex, 'insert-characters');
            setEditorState(newEditorState);
            setTextContent(newEditorState)
        }

        // Check if the current character is an opening '[' and if the suggestion list is shown
        if (currentChar === '[' && showSegmentSuggestions && !noSegment) {
            // Automatically add '}' after inserting suggestion
            const newContentState = state.getCurrentContent();
            const newSelection = selection.merge({
                anchorOffset: currentOffset + 1,
                focusOffset: currentOffset + 1,
            });

            const newContentStateWithClosingBracket = Modifier.insertText(
                newContentState,
                newSelection,
                ']'
            );

            const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
            setEditorState(newEditorState);
            setTextContent(newEditorState)
        }
    };



    /**
     * ==== Handle Before Input ====
     * @param {*} _chars
     * @param {*} editorState
     * @returns
     */
    const handleBeforeInput = (chars, editorState) => {
        // Check if the user typed '{'
        if (chars === '{' || chars === '{{' || chars === '[') {
            const cursorPosition = editorState.getSelection().getAnchorOffset();
            // const editorRect = editorRef.current.getWrapperRef().getBoundingClientRect();

            // console.log("(Before Input) Editor Rect -- ", editorRect);

            // setSuggestionPosition({
            //   left: editorRect.left + cursorPosition * 7, // Adjust the value (15) based on your layout
            //   // top: editorRect.top + editorRect.height, // Adjust the value based on your layout
            //   top: editorRect.height,
            // });

            //  console.log("comming::::::")
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const { top, left, height } = range.getBoundingClientRect();

            // console.log("SELECTING 2 -- ", selection);

            // Calculate the position of the popup
            const caretPosition = {
                top: cursorPosition - 380 + top + 50,
                left:  cursorPosition + left - 400,
            };

            setSuggestionPosition(caretPosition);

            // Move the cursor to the end of the text
            const newEditorState = EditorState.moveFocusToEnd(editorState);
            setEditorState(newEditorState);

            // console.log('Cursor Position:', cursorPosition);
            return 'not-handled';
        }

        // if (chars === '|') {
        //   // Move the cursor to the end of the text
        //   const newEditorState = EditorState.moveFocusToEnd(editorState);
        //   setEditorState(newEditorState);

        //   return 'not-handled';
        // }
    };

    useEffect(() => {
        // console.log('activeParentItem', activeParentItem);
        setActiveMessageParent(activeParentItem)
    }, [activeParentItem])

    /**
     * ==== Handle Clear All =====
     */
    const clearEditor = (e) => {
        e.preventDefault()

        setEditorState(EditorState.createEmpty());
        setIsEditing(false)
        setActiveMessage(activeParentItem?.group_messages[0]);
        setIsEditingMessage(null)
    }


    /**
     * Save editor state and send to parent component
     */
    const saveEdit = (e) => {
        const contentToSave = convertToRaw(editorState.getCurrentContent());

        if(contentToSave?.blocks?.length && contentToSave?.blocks[0]?.text.trim() !== "" && !useForModal) {
            saveMessage(JSON.stringify(contentToSave))
        }

        if (contentToSave?.blocks?.length && contentToSave?.blocks[0]?.text.trim() !== "" && useForModal) {
            const contentMessage = JSON.stringify(contentToSave);
            // console.log("Content Message - ", contentMessage);
            setMessage(contentMessage);
            handleCloseModal();
        }
    }

    useEffect(() => {
        (editorRef && isEditing) && editorRef?.current?.focusEditor()
        let savedMessage;

        if(activeMessage && activeMessage?.message) {
            savedMessage = JSON.parse(activeMessage?.message);
        }

        activeMessage &&
        activeMessage?.message &&
        setEditorState(() => EditorState.createWithContent(convertFromRaw(savedMessage)));

        // console.log('isEditing::::::::', isEditing);
    }, [isEditing]);

    /**
     * ===== Saving Text throw Settings Page =====
     */
    useEffect(() => {
        if (message) {
            const savedMessage = JSON.parse(message);
            setEditorState(EditorState.createWithContent(convertFromRaw(savedMessage)));
        }

        // return () => {
        //     setIsEditingMessage && setIsEditingMessage(null)
        //     setMessage && setMessage(null)
        //     setTextContent && setTextContent("")
        // };
    }, []);


    return (
        <div className='fr-text-editor'>
            <Editor
                editorState={editorState}
                ref={editorRef}
                onEditorStateChange={handleEditorChange}
                handleBeforeInput={handleBeforeInput}
                toolbar={toolbarOptions}
             //   plugins={[emojiPlugin]}
                wrapperClassName="editor-wrapper"
                editorClassName="editor-main"
                toolbarClassName="editor-toolbar"
                style={{ height: '500px !important' }}
            />

            {/* <EmojiSuggestions /> */}

            {showSuggestions && (
                <SuggestionList
                    suggestions={spinTax}
                    positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
                    editorRef={editorRef}
                    setEditorState={setEditorState}
                    setShowSuggestions={setShowSuggestions}
                />
            )}

            {showMergeSugggestions && (
                <SuggestionList
                    suggestions={mergeField}
                    positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
                    editorRef={editorRef}
                    setEditorState={setEditorState}
                    setShowSuggestions={setShowMergeSuggestions}
                />
            )}

            {showSegmentSuggestions && (
                <SuggestionList
                    suggestions={segment}
                    positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
                    editorRef={editorRef}
                    setEditorState={setEditorState}
                    setShowSuggestions={setShowSegmentSuggestions}
                />
            )}

            {/* <SuggestionList /> */}

            {/* ------ ====== [ FOR DEVELOPMENT PURPOSE TO SEE OBJECT WHERE DATA ARE STORING ] ======= ------ */}
            {/*<h2>Data Object Preview</h2>*/}
            {/*<div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>*/}
            {/*<button onClick={handleClearAll}>Clear All</button>*/}
            <footer
                className='editor-edit-controls d-flex f-align-center f-justify-end'
            >
                <Button
                    disable={
                        !useForModal && !isEditing || false
                    }
                    extraClass="editor-cancel btn-grey editor-btn"
                    clickEv={e => {
                        if (useForModal) {
                            handleCloseModal();
                        } else {
                            clearEditor(e);
                        }
                    }}
                    btnText={useForModal ? 'Close' : 'Cancel'}
                />
                {/* {console.log('isEditingisEditingisEditingisEditing', isEditing)} */}
                <Button
                    disable={
                        !convertToRaw(editorState.getCurrentContent())?.blocks?.length ||
                        convertToRaw(editorState.getCurrentContent())?.blocks[0]?.text.trim() === "" ||
                        (!useForModal && !isEditing || false)
                    }
                    extraClass="editor-cancel editor-btn"
                    btnText="Save"
                    clickEv={e => saveEdit(e)}
                />
            </footer>
        </div>
    );
};

export default TextEditor;
