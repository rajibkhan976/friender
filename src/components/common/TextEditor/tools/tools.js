const mergeFieldsDataKeys = {
  "Friend Name": "friendName",
  "Friend First Name": "friendShortName",
  "Friend Gender": "friendGender",
  "Country": "country",
  "Tier": "tier",
  "groupName": "groupName",
  "Keyword": "Keyword",
}
const mergeFieldKeyInjector = (inputString, dataObject) => {
  // Use a regular expression to find all occurrences of keys inside double curly braces
  const regex = /{{(.*?)}}/g;
  const replacedString = inputString.replace(regex, (_, key) => {
    // Trim the key to remove extra spaces
    key = key.trim();

    // Check if the key exists in the dataObject, if not, leave it unchanged
    if (dataObject.hasOwnProperty(key)) {
      return `{{${dataObject[key]}}}`;
    } else {
      return `{{${key}}}`;
    }
  });

  return replacedString;
}
export const tools = {
  ///Text generator function start
  $convertPureString(editorState) {
    const texts = [];

    function traverse(node) {
      if (node.type === "text" && node.text) {
        texts.push(node.text);
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    traverse(editorState.root);

    return texts;
  },
  //Text generator function end

  //html genarator function start
  $generateHtmlFromNodeState(editorState) {
    function convertFormatToHtml(format) {
      switch (format) {
        case 1:
          return '<strong>'; // Bold
        case 2:
          return '<em>'; // Italic
        case 8:
          return '<u>'; // Underline
        case 3:
          return '<strong><em>'; // Bold and Italic
        case 9:
          return '<u><strong>';
        case 10:
          return '<em><u>'; // Italic and Underline
        case 11:
          return '<strong><em><u>'; // Bold, Italic, and Underline
        default:
          return ''; // Plain text
      }
    }

    function closeTags(format) {
      switch (format) {
        case 1:
          return '</strong>'; // Close Bold
        case 2:
          return '</em>'; // Close Italic
        case 8:
          return '</u>'; // Close Underline
        case 3:
          return '</em></strong>'; // Close Bold and Italic
        case 9:
          return '</u></strong>';
        case 10:
          return '</u></em>'; // Close Italic and Underline
        case 11:
          return '</u></em></strong>'; // Close Bold, Italic, and Underline
        default:
          return ''; // No close tag
      }
    }

    let html = '';

    function traverse(node) {
      if (node.type === "text" && node.text) {
        const formatHtml = convertFormatToHtml(node.format);
        const closeFormatHtml = closeTags(node.format);
        const textHtml = node.text.replace(/\n/g, '<br>');
        html += `${formatHtml}${textHtml}${closeFormatHtml}`;
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    traverse(editorState.root);

    return html;
  },
  //html genaration end

 /**
  * this function generating massenger specific text use it only if needed very precise manner
  * @param {*} editorState
  * @returns
  */
  $generateMessengerText(editorState) {
    function convertMessengerText(format) {
      switch (format) {
        case 1:
          return '*'; // Bold
        case 2:
          return '_'; // Italic
        case 3:
          return '*_'; // Bold and Italic
        case 9:
          return '*';
        case 11:
          return '*'; // Bold, Italic, and Underline
        default:
          return ''; // Plain text
      }
    }

    let html = '';

    function traverse(node) {
      if (node.type === "text" && node.text) {
        const formatSign = convertMessengerText(node.format);
        const textHtml = node.text.replace(/\n/g, '<br>');
        html += `${formatSign}${textHtml}${formatSign}`;
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    traverse(editorState.root);
    const mergeFieldInjectedText = mergeFieldKeyInjector(html, mergeFieldsDataKeys)
    return mergeFieldInjectedText;
  }
}
