import createDoublyLinkedList from "@/lib/linkedListFunction";

    let linkedList : any

    function initializeLinks(){
        linkedList = createDoublyLinkedList()
    }

  function convertIntoLinkedList(data : Folder[] , linkedList : any){
    data.forEach((element : any) => {
      linkedList.append(element)
      if(element.children.length > 0){
        convertIntoLinkedList(element.children , linkedList)
      }
    });
  }


export {initializeLinks , convertIntoLinkedList , linkedList}