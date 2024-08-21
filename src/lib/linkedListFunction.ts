function createNode(data: any) {
  return {
    data: data,
    next: null,
    prev: null,
  };
}

function createDoublyLinkedList() {
  let head: any = null;
  let tail: any = null;

  function append(data: any) {
    const newNode = createNode(data);
    if (!head) {
      head = newNode;
      tail = newNode;
    } else {
      tail.next = newNode;
      newNode.prev = tail;
      tail = newNode;
    }
  }

  function findNode(fileID: any) {
    let current = head;
    while (current) {
      if (current.data.fileId === fileID) {
        return current;
      }
      current = current.next;
    }
    return null; // Return null if no node with the given fileID is found
  }

  return {
    append,
    findNode,
  };
}

export default createDoublyLinkedList;
