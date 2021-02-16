const handleClick = event => {
    event.preventDefault();
    const $containerMain = document.querySelector(".containerMain");
    if ($containerMain.innerHTML === '') {
        $containerMain.innerHTML = `
            <div class="gray-rectangle"></div>
            <span class="textarea" role="textbox" contenteditable></span>
            <button><i class="far fa-calendar fa-lg"></i></button>
            <div class="selectDiv">
                <select>
                    <option>&#xf0c8;&nbsp;&nbsp;No list</option>
                </select>
            </div>`;

        const $texarea = document.querySelector(".textarea");
        $texarea.addEventListener('input', handleTextChange, false);

        // put a caret on textarea
        let range = document.createRange(); 
        range.collapse(true);
        range.selectNodeContents($texarea);
        range.collapse(true);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

const handleTextChange = event => {
    const target = event.target;
  
    // insert note
    if (target.innerText.endsWith('//') 
        && event.inputType !== "deleteContentBackward"
        && target.innerHTML.search('<p class="note') === -1) {
        target.innerText = target.innerText.replace('//', '');
        
        let range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(true);

        // add '//'
        range.setEndAfter(target.lastChild);
        range.setStartAfter(target.lastChild);
        let newNode = document.createElement('p');
        newNode.className = "note";
        newNode.innerHTML = "//";
        range.insertNode(newNode); 

        // put a caret at the start of a note
        range.collapse(true);
        range.setEndAfter(newNode.firstChild);
        range.setStartAfter(newNode.firstChild);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);  
    }

    // deleting of '//' - remove added tags
    if (target.innerText.search('//') === -1 && target.innerText.endsWith('/') && event.inputType === "deleteContentBackward") {  
        target.innerHTML = target.innerHTML.slice(0, target.innerHTML.search('<p class="note')) + '/';
        
        // put a caret at the end of entered text
        let range = document.createRange(); 
        range.collapse(true);
        range.setEndAfter(target.lastChild);
        range.setStartAfter(target.lastChild);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    //::after content for note, if not empty - delete, if empty - add
    if (target.innerHTML.search('<p class="note') > 1) {
        $noteArea = document.querySelector(".note");
        if ($noteArea.className === "note" && $noteArea.innerText.trim() != "//") {
            $noteArea.className = "note noteNoAfter";
        } else if ($noteArea.innerText.trim() == "//" && event.inputType === "deleteContentBackward") {
            $noteArea.className = "note";
        }
    }
}

document.querySelector(".containerMain").addEventListener('click', handleClick, true);