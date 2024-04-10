import { useCallback, useState } from 'react'; // Import useCallback hook
import { EditorState, Modifier } from 'draft-js'; // Import EditorState and Modifier
import "./style/SuggestionList.scss";
import { EditorSearchIcon } from '../../../assets/icons/Icons';


const SuggestionList = ({ positions, suggestions, editorRef, setEditorState, setShowSuggestions }) => {
    const [spinTaxData, setSpinTaxData] = useState([...suggestions]);

    /**
     * ===== Handle Suggestion Select with different brackets here =====
     */
    const handleSuggestionSelect = useCallback(
        (suggestion) => {
            const currentEditorState = editorRef.current.getEditorState();
            const selection = currentEditorState.getSelection();
            const contentState = currentEditorState.getCurrentContent();
            const currentBlockKey = selection.getStartKey();
            const currentBlock = contentState.getBlockForKey(currentBlockKey);
            const currentOffset = selection.getStartOffset();
            const currentText = currentBlock.getText();
            const currentChar = currentText.charAt(currentOffset - 1);

            // Find the index of the opening character in the current line
            const openingBraceIndex = currentText.lastIndexOf('{', currentOffset);
            const openingDoubleBraceIndex = currentText.lastIndexOf('{{', currentOffset);
            const openingAngleBraceIndex = currentText.lastIndexOf('[', currentOffset);
            let closingBrace = null;

            const stickIndex = currentText.lastIndexOf('|', currentOffset);

            // Check to opens the '{{}}' Merge field..
            if (openingDoubleBraceIndex !== -1) {

                console.log("====== {{}} =====");

                closingBrace = '}}';
                // Find the index of the closing '}}' character after the opening '{{' character.
                const closingDoubleBraceIndex = currentText.indexOf('}}', openingDoubleBraceIndex);

                if (closingDoubleBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText = currentText.substring(openingDoubleBraceIndex + 1, closingDoubleBraceIndex - 1) + suggestion + currentText.substring(closingDoubleBraceIndex);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingDoubleBraceIndex,
                            focusOffset: closingDoubleBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    // console.log("New Text -- ", newText);
                    // console.log("making starting {{ : ", currentText.substring(openingDoubleBraceIndex + 1, closingDoubleBraceIndex - 1));
                    // console.log("ending with }} : ", currentText.substring(closingDoubleBraceIndex));

                    // Update the editor state with the new content state
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing '}}' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);
                }
            }


            // Check to open '{}' Spintax field..
            if (openingBraceIndex !== -1) {

                console.log("====== {} =====");

                closingBrace = '}';
                // Find the index of the closing '}' character after the opening '{' character.
                const closingBraceIndex = currentText.indexOf('}', openingBraceIndex);

                if (closingBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    let newText = currentText.substring(openingBraceIndex + 1, closingBraceIndex - 1) + suggestion + currentText.substring(closingBraceIndex);
                    // const newText2 = currentText.substring(openingBraceIndex + closingBrace.length, closingBraceIndex) + suggestion + currentText.substring(closingBraceIndex + closingBrace.length);

                    // When you needs make separated '|' with many Sugestion..
                    if (stickIndex !== -1 && currentChar === '|') {
                        newText = currentText.substring(openingBraceIndex, closingBraceIndex - 1) + '|' + suggestion + currentText.substring(closingBraceIndex);
                        // console.log("With Stick Next Text -- ", newText);
                        // console.log("Suggestion -- ", suggestion);
                    }

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingBraceIndex,
                            focusOffset: closingBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    // console.log("New Text -- ", newText);
                    // console.log("making starting { : ", currentText.substring(openingBraceIndex + 1, closingBraceIndex - 1));
                    // console.log("ending with } : ", currentText.substring(closingBraceIndex));

                    // Update the editor state with the new content state
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing '}' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);
                }
            }


            // Check to opens the '[]' Segment field..
            if (openingAngleBraceIndex !== -1) {

                console.log("====== [] =====");

                closingBrace = ']';
                // Find the index of the closing ']' character after the opening '[' character.
                const closingAngelBraceIndex = currentText.indexOf(']', openingAngleBraceIndex);

                if (closingAngelBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText = currentText.substring(openingAngleBraceIndex + 1, closingAngelBraceIndex - 1) + suggestion + currentText.substring(closingAngelBraceIndex);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingAngleBraceIndex,
                            focusOffset: closingAngelBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    // console.log("New Text -- ", newText);
                    // console.log("making starting [ : ", currentText.substring(openingAngleBraceIndex + 1, closingAngelBraceIndex - 1));
                    // console.log("ending with ] : ", currentText.substring(closingAngelBraceIndex));

                    // Update the editor state with the new content state
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing ']' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);
                }
            }

        },
        [editorRef, setEditorState]
    );



    /**
     * ==== Handle the search of suggestion list ====
     * @param {*} event
     */
    const handleSearchChange = (event) => {
        const { value } = event.target;
        const filteredSpinTaxData = suggestions.filter(data => data.toLowerCase().indexOf(value.toLowerCase()) > -1);
        setSpinTaxData(filteredSpinTaxData);
    };


    return (
        <>
            <div className="suggestion-list" style={{
                left: positions?.left,
                top: positions?.top,
            }}>

                <div className='suggestion-search'>
                    <EditorSearchIcon width={18} height={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="suggestion-searchbar"
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="suggestion-scroll-list">
                    <ul>
                        {spinTaxData.length && spinTaxData.map((spin, index) => (
                            <li key={index} onClick={() => handleSuggestionSelect(spin)}>{spin}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SuggestionList;
