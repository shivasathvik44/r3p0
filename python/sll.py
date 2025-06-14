class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add a new node to the end of the list"""
        new_node = Node(data)
        
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data):
        """Add a new node to the beginning of the list"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        """Delete first occurrence of data"""
        if not self.head:
            return
        
        if self.head.data == data:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next
    
    def display(self):
        """Print the linked list"""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements))
    
    def search(self, data):
        """Search for a node with given data"""
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False

# Example usage
if __name__ == "__main__":
    # Create a new linked list
    ll = LinkedList()
    
    # Append some elements
    ll.append(10)
    ll.append(20)
    ll.append(30)
    
    # Prepend an element
    ll.prepend(5)
    
    # Display the list
    print("Initial list:")
    ll.display()
    
    # Delete an element
    ll.delete(20)
    print("\nAfter deleting 20:")
    ll.display()
    
    # Search for elements
    print("\nSearching for 30:", ll.search(30))
    print("Searching for 20:", ll.search(20))