import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
//import {LexicalEditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin"
//import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
//import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import "./editor.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
//import MentionsPlugin from "./plugins/MentionPlugin";
//import NewMentionsPlugin from "./plugins/MentionPlugin";

import { $getRoot, $getSelection } from "lexical";
import { $createParagraphNode } from "lexical";
import SegmentPlugin from "./plugins/SuggestionPlugins/SegmentPlugin";
import MergeFieldPlugin from "./plugins/SuggestionPlugins/MergeFieldPlugin";
import Button from "../../formComponents/Button";
import { tools } from "./tools/tools";
import moment from "moment";

// Current Time as UTC format..
const getCurrentUTCTime = () => moment().utc().format("YYYY-MM-DD HH:mm:ss");


// import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
// import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
// import AutoLinkPlugin from "./plugins/AutoLinkPlugin";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  namespace: "frTextEditor",
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

function UpdateEditorPlugin({ editorValueData }) {
  //this function will load once at first
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    /// console.log("the dataaaaaaaaaaaaaaaaaaaa", editorValueData);
    if (editorValueData) {
      // console.log("the dataaaaaaaaaaaaaaaaaaaa", editorValueData);
      const editorState = editor.parseEditorState(editorValueData);
      editor.setEditorState(editorState);
    }
  }, []);
}





// When the editor changes, you can get notified via the
// OnChangePlugin!
function OnChangePlugin({ onChange }) {
  // Access the editor through the LexicalComposerContext
  const [editor] = useLexicalComposerContext();
  // Wrap our listener in useEffect to handle the teardown and avoid stale references.
  // let transfromState={}
  useEffect(() => {
    // editor.update(() => {
    //   transfromState["text"]= $convertToMarkdownString(TRANSFORMERS);
    //   transfromState["html"]= $generateHtmlFromNodes(editor,null)
    //    console.log("pure text output____",transfromState);

    // });

    // most listeners return a teardown function that can be called to clean them up.
    return editor.registerUpdateListener(({ editorState }) => {
      // call onChange here to pass the latest state up to the parent.


      //transfromState["text"]= extractTextFromEditorState(editorState).join(" ");
      onChange(editorState);
    });
  }, [editor, onChange]);
}

export default function TextEditor({
	editorStateValue,
	setEditorStateValue,
	useForModal = false,
	isEditing = { readyToEdit: true, addNewSub: false },
	cancleFun,
	saveMessage,
	needSegment = true,
	setModalOpen = null,
	modalType = "",
	isExtanded = false,
	setTextContent = null,
	autoFocus = true,
	oldGroupId = null,
	isEditorModalOpen=null,
}) {
	const [editorState, setEditorState] = useState();
	function onChange(editorState) {
		// Call toJSON on the EditorState object, which produces a serialization safe string
		const editorStateJSON = editorState.toJSON();
		// However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
		setEditorState(JSON.stringify(editorStateJSON));
		// setEditorState(transfromState);
	}
	// const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// const editorStateJSON = editorState.toJSON();
		// console.log("hellooeee", editorState);
		setEditorStateValue(editorState);
		setTextContent && setTextContent(editorState);
	}, [editorState]);

	const handleSavebtnClick = () => {
		const tempMsgObj = JSON.parse(editorState);
		// console.log("at saveeeeeeee",tempMsgObj)
		const msgObj = {
			__raw: editorState,
			html: tools.$generateHtmlFromNodeState(tempMsgObj),
			text: tools.$convertPureString(tempMsgObj).join(" "),
			messengerText: tools.$generateMessengerText(tempMsgObj),
		};

		if (msgObj?.text.trim() !== "") {
			saveMessage(msgObj);
		}

		if (oldGroupId) {
			localStorage.setItem("old_message_group_id", oldGroupId);
		}

		if (useForModal) {
			if (modalType === "ACCEPT_REQ") {
				localStorage.removeItem("fr_using_select_accept");

				// When Turn Of Setting then setting the Current UTC Time..
				// payload.send_message_when_someone_accept_new_friend_request_settings.settings_added_time = getCurrentUTCTime();
				localStorage.setItem(
					"currentUTC_someone_accept_new_frnd_req",
					getCurrentUTCTime()
				);
			}

			if (modalType === "REJECT_REQ") {
				localStorage.removeItem("fr_using_select_rejt");
			}

			if (modalType === "SOMEONE_SEND_REQ") {
				localStorage.removeItem("fr_using_someone_send");
			}

			if (modalType === "REJT_INCOMING_REQ") {
				localStorage.removeItem("fr_using_rejt_incoming");
			}

			if (modalType === "ACCEPT_INCOMING_REQ") {
				localStorage.removeItem("fr_using_accept_incoming");
			}

			if (
				modalType === "CAMPAIGNS_MESSAGE" ||
				modalType === "CAMPAIGNS_MODAL_MESSAGE"
			) {
				localStorage.removeItem("fr_using_campaigns_message");
			}

			if (
				modalType === "FR_QUE_REQ_SENT"
			) {
				localStorage.removeItem("fr_using_que_sent_message");
			}

			if (
				modalType === "FR_QUE_REQ_ACCEPT"
			) {
				localStorage.removeItem("fr_using_que_accept_message");
			}

			setModalOpen(false);
		}
	};

	useEffect(() => {
		return () => {
			setEditorState();
		};
	}, []);

	return (
		<div className='fr-text-editor'>
			{/* <p className="editor-title-announce">Message <span className="important-asterisk">*</span></p> */}
			<h4 className='message-title-editor'>
				Message <span className='error-text-inline'>*</span>
			</h4>
			<LexicalComposer initialConfig={editorConfig}>
				<div className='text-editor-container'>
					<ToolbarPlugin />
					<div className='editor-inner'>
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className={`editor-input ${
										isExtanded && "expanded-editor-input"
									}`}
								/>
							}
							placeholder={<Placeholder />}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						{(isEditorModalOpen === null || isEditorModalOpen) && (
							<>
								<HistoryPlugin />
								{/* <LexicalEditorRefPlugin ref={editorRef} /> */}
								{/* <TreeViewPlugin /> */}
								<UpdateEditorPlugin
									editorValueData={isEditing.addNewSub ? "" : editorStateValue}
								/>
								{needSegment && <SegmentPlugin />}
								<MergeFieldPlugin />
								<OnChangePlugin onChange={onChange} />
								{autoFocus && <AutoFocusPlugin />}
								{/* <CodeHighlightPlugin /> */}
								<ListPlugin />
								<LinkPlugin />
								{/* <AutoLinkPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} /> */}
								<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
							</>
						)}
					</div>
				</div>
			</LexicalComposer>
			<footer className='editor-edit-controls d-flex f-align-center f-justify-end'>
				<Button
					disable={(!useForModal && !isEditing.readyToEdit) || false}
					extraClass='editor-cancel btn-grey editor-btn'
					clickEv={(e) => {
						cancleFun();
					}}
					btnText={useForModal ? "Close" : "Cancel"}
				/>
				{/* {// console.log('isEditingisEditingisEditingisEditing', isEditing)} */}
				<Button
					// disable={
					//   editorState && tools.$convertPureString(JSON.parse(editorState)).length <= 0
					// }
					disable={
						(editorState &&
							tools.$convertPureString(JSON.parse(editorState)).length <= 0) ||
						(isEditing.addNewSub && !isEditing.readyToEdit)
					}
					extraClass='editor-cancel editor-btn'
					btnText='Save'
					clickEv={(e) => {
						handleSavebtnClick(e);
					}}
				/>
			</footer>
		</div>
	);
}
