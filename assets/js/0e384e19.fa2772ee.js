"use strict";(self.webpackChunkbeanio_github_org=self.webpackChunkbeanio_github_org||[]).push([[671],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,c=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=d(n),p=a,f=u["".concat(c,".").concat(p)]||u[p]||m[p]||l;return n?r.createElement(f,i(i({ref:t},s),{},{components:n})):r.createElement(f,i({ref:t},s))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,i=new Array(l);i[0]=p;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[u]="string"==typeof e?e:a,i[1]=o;for(var d=2;d<l;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},9881:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>l,metadata:()=>o,toc:()=>d});var r=n(7462),a=(n(7294),n(3905));const l={id:"intro",title:"Introduction to BeanIO",sidebar_label:"Introduction",slug:"/"},i=void 0,o={unversionedId:"intro",id:"intro",title:"Introduction to BeanIO",description:"BeanIO is an open source Java framework for marshalling and unmarshalling",source:"@site/docs/intro.md",sourceDirName:".",slug:"/",permalink:"/docs/",draft:!1,editUrl:"https://github.com/beanio/beanio.github.io/edit/main/docs/intro.md",tags:[],version:"current",frontMatter:{id:"intro",title:"Introduction to BeanIO",sidebar_label:"Introduction",slug:"/"},sidebar:"someSidebar",next:{title:"Reference Guide",permalink:"/docs/reference-guide"}},c={},d=[{value:"Features",id:"features",level:2},{value:"A Quick Example",id:"a-quick-example",level:2}],s={toc:d};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"BeanIO")," is an open source Java framework for marshalling and unmarshalling\nJava beans from a flat file, stream, or simple ",(0,a.kt)("inlineCode",{parentName:"p"},"String")," object."),(0,a.kt)("h2",{id:"features"},"Features"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Support for XML, CSV, delimited and fixed length stream formats"),(0,a.kt)("li",{parentName:"ul"},"XML, Java annotations or builder API based field mapping"),(0,a.kt)("li",{parentName:"ul"},"Configurable record ordering and grouping rules"),(0,a.kt)("li",{parentName:"ul"},"Object binding that spans multiple records"),(0,a.kt)("li",{parentName:"ul"},"Record identification by one or more field values, or by record length"),(0,a.kt)("li",{parentName:"ul"},"Common field validation rules with customizable error messages"),(0,a.kt)("li",{parentName:"ul"},"Extensible stream parsing and type handling"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("del",null,"Integration with ",(0,a.kt)("a",{href:"http://static.springsource.org/spring-batch/"},"Spring Batch"))),(0,a.kt)("li",{parentName:"ul"},"OSGi compatible")),(0,a.kt)("h2",{id:"a-quick-example"},"A Quick Example"),(0,a.kt)("p",null,"Let's suppose you want to read and write a CSV flat file of contact information\nwith the following record layout:"),(0,a.kt)("table",null,(0,a.kt)("tr",null,(0,a.kt)("th",null,"\xa0"),(0,a.kt)("th",null,"Field Name"),(0,a.kt)("th",null,"Format")),(0,a.kt)("tr",null,(0,a.kt)("td",{colspan:"3"},(0,a.kt)("i",null,"Header Record"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"0"),(0,a.kt)("td",null,"Record Type"),(0,a.kt)("td",null,'"H"')),(0,a.kt)("tr",null,(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"File Date"),(0,a.kt)("td",null,"Date (YYYY-MM-DD)")),(0,a.kt)("tr",null,(0,a.kt)("td",{colspan:"3"},(0,a.kt)("i",null,"Detail Record"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"0"),(0,a.kt)("td",null,"Record Type"),(0,a.kt)("td",null,'"D"')),(0,a.kt)("tr",null,(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"First Name"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",null,"2"),(0,a.kt)("td",null,"Last Name"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",null,"3"),(0,a.kt)("td",null,"Street"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",null,"4"),(0,a.kt)("td",null,"City"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",null,"5"),(0,a.kt)("td",null,"State"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",null,"6"),(0,a.kt)("td",null,"Zip"),(0,a.kt)("td",null,"String")),(0,a.kt)("tr",null,(0,a.kt)("td",{colspan:"3"},(0,a.kt)("i",null,"Trailer Record"))),(0,a.kt)("tr",null,(0,a.kt)("td",null,"0"),(0,a.kt)("td",null,"Record Type"),(0,a.kt)("td",null,'"T"')),(0,a.kt)("tr",null,(0,a.kt)("td",null,"1"),(0,a.kt)("td",null,"Detail Record Count"),(0,a.kt)("td",null,"Integer"))),(0,a.kt)("p",null,"A sample input file could look like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"H,2012-05-19\nD,Joe,Johnson,123 Main St,Chicago,IL,60610\nD,Jane,Smith,,,,\nD,Albert,Jackson,456 State St,Chicago,IL,60614\nT,3\n")),(0,a.kt)("p",null,"And let's suppose you want to bind detail records to the following Java class."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"package example;\n\npublic class Contact {\n    String firstName;\n    String lastName;\n    String street;\n    String city;\n    String state;\n    String zip;\n    \n    // getters and setters not shown...\n}\n")),(0,a.kt)("p",null,'BeanIO is configured using an XML mapping file.  A 2.0 mapping file named "contacts.xml"\n(shown below) can be used to read and write our CSV contacts file.'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'<beanio xmlns="http://www.beanio.org/2012/03">\n\n   \x3c!-- \'format\' identifies the type of stream --\x3e\n   <stream name="contacts" format="csv">\n      \x3c!-- \'class\' binds the header record to a java.util.HashMap --\x3e\n      <record name="header" class="map">\n         \x3c!-- \'rid\' indicates this field is used to identify the record --\x3e\n         <field name="recordType" rid="true" literal="H" />\n         \x3c!-- \'format\' can be used to provide Date and Number formats --\x3e\n         <field name="fileDate" type="date" format="yyyy-MM-dd" />\n      </record>\n\n      \x3c!-- Detail records are bound to example.Contact --\x3e\n      <record name="contact" class="example.Contact">\n         \x3c!-- \'ignore\' indicates this field is not bound to a bean property --\x3e\n         <field name="recordType" rid="true" literal="D" ignore="true" />\n         <field name="firstName" />\n         <field name="lastName" />\n         <field name="street" />\n         <field name="city" />\n         <field name="state" />\n         <field name="zip" />\n      </record>\n\n      \x3c!-- \'target\' binds the trailer record to the Integer record count field --\x3e\n      <record name="trailer" target="recordCount">\n         \x3c!-- \'literal\' is used to define constant values --\x3e\n         <field name="recordType" rid="true" literal="T" />\n         \x3c!-- \'type\' can be declared where bean introspection is not possible --\x3e\n         <field name="recordCount" type="int" />\n      </record>\n\n   </stream>\n</beanio>\n')),(0,a.kt)("p",null,"Using the mapping file and bean object from above, the following code will read\nand write our CSV contacts file. (For brevity, exception handling is lacking.)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'package example;\n\nimport org.beanio.*;\nimport java.io.*;\n\npublic class ExampleMain {\n\n   public static void main(String[] args) throws Exception {\n      // create a BeanIO StreamFactory\n      StreamFactory factory = StreamFactory.newInstance();\n      // load the mapping file from the working directory\n      factory.load("contacts.xml");\n\n      // create a BeanReader to read from "input.csv"\n      BeanReader in = factory.createReader("contacts", new File("input.csv"));\n      // create a BeanWriter to write to "output.csv"\n      BeanWriter out = factory.createWriter("contacts", new File("output.csv"));\n\n      Object record = null;\n\n      // read records from "input.csv"\n      while ((record = in.read()) != null) {\n\n         // process each record\n         if ("header".equals(in.getRecordName())) {\n            Map<String, Object> header = (Map<String, Object>) record;\n            System.out.println(header.get("fileDate"));\n         } else if ("contact".equals(in.getRecordName())) {\n            Contact contact = (Contact) record;\n            // process the contact...\n         } else if ("trailer".equals(in.getRecordName())) {\n            Integer recordCount = (Integer) record;\n            System.out.println(recordCount + " contacts processed");\n         }\n\n         // write the record to "output.csv"\n         out.write(record);\n      }\n\n      in.close();\n\n      out.flush();\n      out.close();\n   }\n}\n')),(0,a.kt)("p",null,"That's it! But of course, BeanIO supports many other cool\nfeatures. For example, if we wanted to strictly validate our contacts input\nfile, we could make the following additions to our mapping file."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'<beanio xmlns="http://www.beanio.org/2012/03">\n\n  \x3c!-- \'strict\' enforces record order and record sizes --\x3e\n  <stream name="contacts" format="csv" strict="true">\n    \x3c!-- \'occurs\' enforces minimum and maximum record occurrences --\x3e\n    <record name="header" class="map" occurs="1">\n      <field name="recordType" rid="true" literal="H" />\n      \x3c!-- \'required\' indicates a field value is required --\x3e\n      <field name="fileDate" type="date" format="yyyy-MM-dd" required="true"/>\n    </record>  \n  \n    <record name="contact" class="example.Contact" occurs="0+">\n      <field name="recordType" rid="true" literal="D" ignore="true" />\n      \x3c!-- \'maxLength\' enforces a maximum String length --\x3e\n      <field name="firstName" maxLength="20" />\n      <field name="lastName" required="true" maxLength="30" />\n      <field name="street" maxLength="30" />\n      <field name="city" maxLength="25" />\n      <field name="state" minLength="2" maxLength="2" />\n      \x3c!-- \'regex\' enforces pattern matching --\x3e\n      <field name="zip" regex="\\d{5}" />\n    </record>\n\n    <record name="trailer" target="recordCount" occurs="1">\n      <field name="recordType" rid="true" literal="T" />\n      <field name="recordCount" type="int" required="true" />\n    </record>  \n    \n  </stream>\n</beanio>\n')),(0,a.kt)("p",null,"Prefer to annotate the ",(0,a.kt)("inlineCode",{parentName:"p"},"Contact")," class instead?"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'package example;\n\n@Record(minOccurs=0, maxOccurs=-1)\n@Fields({\n    @Field(at=0, name="recordType", rid=true, literal="D")\n})\npublic class Contact {\n\n    @Field(at=1, maxLength=20)\n    String firstName;   \n    @Field(at=2, required=true, maxLength=30)\n    String lastName;\n    @Field(at=3, maxLength=30)\n    String street;\n    @Field(at=4, maxLength=25)\n    String city;\n    @Field(at=5, minLength=2, maxLength=2)\n    String state;\n    @Field(at=6, regex="\\d{5}")\n    String zip;\n    \n    // getters and setters not shown...\n')),(0,a.kt)("p",null,"Need to support XML?  Simply change the stream ",(0,a.kt)("inlineCode",{parentName:"p"},"format")," to 'xml', remove\nthe ",(0,a.kt)("inlineCode",{parentName:"p"},"recordType")," fields, and presto!  You can now read and write documents\nlike the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},"<contacts>\n  <header>\n    <fileDate>2012-05-19</fileDate>\n  </header>\n  <contact>\n    <firstName>Joe</firstName>\n    <lastName>Johnson</lastName>\n    <street>123 Main St</street>\n    <city>Chicago</city>\n    <state>IL</state>\n    <zip>60610</zip>\n  </contact>\n  <contact>\n    <firstName>Jane</firstName>\n    <lastName>Smith</lastName>\n    <street/>\n    <city/>\n    <state/>\n    <zip/>\n  </contact>\n  <trailer>\n    <recordCount>2</recordCount>\n  </trailer>\n</contacts>\n")),(0,a.kt)("p",null,"But that's not all, check out the ",(0,a.kt)("a",{parentName:"p",href:"reference-guide"},"reference guide"),"\nfor more information."))}u.isMDXComponent=!0}}]);