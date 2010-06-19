//第六章 Dom基础

/*
-------------------------
xml:
Document            最顶层的节点
DocumentType        DTD引用的对象表现形式，不能包含子节点
DocumentFragment    文档碎片，可以像Document一亲来保存其他节点
Element             表示起始标签和结束标签之间的内容，这是唯一可以同时包含特性和子节点的节点类型
Attr                代表一对特性名和特性值，不能包含子节点
CDataSection        <![CDATA[]]>的对象表现形式，这个节点类型仅能包含文本节点Text作为子节点
Comment             代表XML注释
-------------------------
Node.ELEMENT_NODE (1)
Node.TEXT_NODE (2)
Node.DOCUMENT_NODE (9)
-------------------------
特性/方法         类型/返回类型         说明
nodeName        String
nodeValue       String
nodeType        Number
ownerDocument   Document            指向这个节点所属的文档
firstChild      Node
lastChild       Node
childNodes      NodeList
previousSibling Node
nextSibling     Node
hasChildNode()  Boolean
attributes      NameNodeMap
appendChild(node)   Node
removeChild(node)   Node
replaceChild(newnode, oldnode)  Node
insertBefore(newnode, refnode)  Node
-------------------------
*/


