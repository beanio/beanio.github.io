(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{61:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return o})),n.d(t,"default",(function(){return b}));var a=n(3),r=n(7),l=(n(0),n(86)),c={id:"intro",title:"Introduction to BeanIO",sidebar_label:"Introduction",slug:"/"},i={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Introduction to BeanIO",description:"BeanIO is an open source Java framework for marshalling and unmarshalling",source:"@site/docs/intro.md",slug:"/",permalink:"/docs/",editUrl:"https://github.com/beanio/beanio.github.com/edit/master/docs/docs/intro.md",version:"current",sidebar_label:"Introduction",sidebar:"someSidebar",next:{title:"Reference Guide",permalink:"/docs/reference-guide"}},o=[{value:"Features",id:"features",children:[]},{value:"A Quick Example",id:"a-quick-example",children:[]}],d={toc:o};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(l.b)("wrapper",Object(a.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(l.b)("p",null,Object(l.b)("strong",{parentName:"p"},"BeanIO")," is an open source Java framework for marshalling and unmarshalling\nJava beans from a flat file, stream, or simple ",Object(l.b)("inlineCode",{parentName:"p"},"String")," object."),Object(l.b)("h2",{id:"features"},"Features"),Object(l.b)("ul",null,Object(l.b)("li",{parentName:"ul"},"Support for XML, CSV, delimited and fixed length stream formats"),Object(l.b)("li",{parentName:"ul"},"XML, Java annotations or builder API based field mapping"),Object(l.b)("li",{parentName:"ul"},"Configurable record ordering and grouping rules"),Object(l.b)("li",{parentName:"ul"},"Object binding that spans multiple records"),Object(l.b)("li",{parentName:"ul"},"Record identification by one or more field values, or by record length"),Object(l.b)("li",{parentName:"ul"},"Common field validation rules with customizable error messages"),Object(l.b)("li",{parentName:"ul"},"Extensible stream parsing and type handling"),Object(l.b)("li",{parentName:"ul"},Object(l.b)("del",null,"Integration with ",Object(l.b)("a",{href:"http://static.springsource.org/spring-batch/"},"Spring Batch"))),Object(l.b)("li",{parentName:"ul"},"OSGi compatible")),Object(l.b)("h2",{id:"a-quick-example"},"A Quick Example"),Object(l.b)("p",null,"Let's suppose you want to read and write a CSV flat file of contact information\nwith the following record layout:"),Object(l.b)("table",null,Object(l.b)("tr",null,Object(l.b)("th",null,"\xa0"),Object(l.b)("th",null,"Field Name"),Object(l.b)("th",null,"Format")),Object(l.b)("tr",null,Object(l.b)("td",{colspan:"3"},Object(l.b)("i",null,"Header Record"))),Object(l.b)("tr",null,Object(l.b)("td",null,"0"),Object(l.b)("td",null,"Record Type"),Object(l.b)("td",null,'"H"')),Object(l.b)("tr",null,Object(l.b)("td",null,"1"),Object(l.b)("td",null,"File Date"),Object(l.b)("td",null,"Date (YYYY-MM-DD)")),Object(l.b)("tr",null,Object(l.b)("td",{colspan:"3"},Object(l.b)("i",null,"Detail Record"))),Object(l.b)("tr",null,Object(l.b)("td",null,"0"),Object(l.b)("td",null,"Record Type"),Object(l.b)("td",null,'"D"')),Object(l.b)("tr",null,Object(l.b)("td",null,"1"),Object(l.b)("td",null,"First Name"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",null,"2"),Object(l.b)("td",null,"Last Name"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",null,"3"),Object(l.b)("td",null,"Street"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",null,"4"),Object(l.b)("td",null,"City"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",null,"5"),Object(l.b)("td",null,"State"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",null,"6"),Object(l.b)("td",null,"Zip"),Object(l.b)("td",null,"String")),Object(l.b)("tr",null,Object(l.b)("td",{colspan:"3"},Object(l.b)("i",null,"Trailer Record"))),Object(l.b)("tr",null,Object(l.b)("td",null,"0"),Object(l.b)("td",null,"Record Type"),Object(l.b)("td",null,'"T"')),Object(l.b)("tr",null,Object(l.b)("td",null,"1"),Object(l.b)("td",null,"Detail Record Count"),Object(l.b)("td",null,"Integer"))),Object(l.b)("p",null,"A sample input file could look like this:"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre"},"H,2012-05-19\nD,Joe,Johnson,123 Main St,Chicago,IL,60610\nD,Jane,Smith,,,,\nD,Albert,Jackson,456 State St,Chicago,IL,60614\nT,3\n")),Object(l.b)("p",null,"And let's suppose you want to bind detail records to the following Java class."),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-java"},"package example;\n\npublic class Contact {\n    String firstName;\n    String lastName;\n    String street;\n    String city;\n    String state;\n    String zip;\n    \n    // getters and setters not shown...\n}\n")),Object(l.b)("p",null,'BeanIO is configured using an XML mapping file.  A 2.0 mapping file named "contacts.xml"\n(shown below) can be used to read and write our CSV contacts file.'),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-xml"},'<beanio xmlns="http://www.beanio.org/2012/03">\n\n   \x3c!-- \'format\' identifies the type of stream --\x3e\n   <stream name="contacts" format="csv">\n      \x3c!-- \'class\' binds the header record to a java.util.HashMap --\x3e\n      <record name="header" class="map">\n         \x3c!-- \'rid\' indicates this field is used to identify the record --\x3e\n         <field name="recordType" rid="true" literal="H" />\n         \x3c!-- \'format\' can be used to provide Date and Number formats --\x3e\n         <field name="fileDate" type="date" format="yyyy-MM-dd" />\n      </record>\n\n      \x3c!-- Detail records are bound to example.Contact --\x3e\n      <record name="contact" class="example.Contact">\n         \x3c!-- \'ignore\' indicates this field is not bound to a bean property --\x3e\n         <field name="recordType" rid="true" literal="D" ignore="true" />\n         <field name="firstName" />\n         <field name="lastName" />\n         <field name="street" />\n         <field name="city" />\n         <field name="state" />\n         <field name="zip" />\n      </record>\n\n      \x3c!-- \'target\' binds the trailer record to the Integer record count field --\x3e\n      <record name="trailer" target="recordCount">\n         \x3c!-- \'literal\' is used to define constant values --\x3e\n         <field name="recordType" rid="true" literal="T" />\n         \x3c!-- \'type\' can be declared where bean introspection is not possible --\x3e\n         <field name="recordCount" type="int" />\n      </record>\n\n   </stream>\n</beanio>\n')),Object(l.b)("p",null,"Using the mapping file and bean object from above, the following code will read\nand write our CSV contacts file. (For brevity, exception handling is lacking.)"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-java"},'package example;\n\nimport org.beanio.*;\nimport java.io.*;\n\npublic class ExampleMain {\n\n   public static void main(String[] args) throws Exception {\n      // create a BeanIO StreamFactory\n      StreamFactory factory = StreamFactory.newInstance();\n      // load the mapping file from the working directory\n      factory.load("contacts.xml");\n\n      // create a BeanReader to read from "input.csv"\n      BeanReader in = factory.createReader("contacts", new File("input.csv"));\n      // create a BeanWriter to write to "output.csv"\n      BeanWriter out = factory.createWriter("contacts", new File("output.csv"));\n\n      Object record = null;\n\n      // read records from "input.csv"\n      while ((record = in.read()) != null) {\n\n         // process each record\n         if ("header".equals(in.getRecordName())) {\n            Map<String, Object> header = (Map<String, Object>) record;\n            System.out.println(header.get("fileDate"));\n         } else if ("contact".equals(in.getRecordName())) {\n            Contact contact = (Contact) record;\n            // process the contact...\n         } else if ("trailer".equals(in.getRecordName())) {\n            Integer recordCount = (Integer) record;\n            System.out.println(recordCount + " contacts processed");\n         }\n\n         // write the record to "output.csv"\n         out.write(record);\n      }\n\n      in.close();\n\n      out.flush();\n      out.close();\n   }\n}\n')),Object(l.b)("p",null,"That's it! But of course, BeanIO supports many other cool\nfeatures. For example, if we wanted to strictly validate our contacts input\nfile, we could make the following additions to our mapping file."),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-xml"},'<beanio xmlns="http://www.beanio.org/2012/03">\n\n  \x3c!-- \'strict\' enforces record order and record sizes --\x3e\n  <stream name="contacts" format="csv" strict="true">\n    \x3c!-- \'occurs\' enforces minimum and maximum record occurrences --\x3e\n    <record name="header" class="map" occurs="1">\n      <field name="recordType" rid="true" literal="H" />\n      \x3c!-- \'required\' indicates a field value is required --\x3e\n      <field name="fileDate" type="date" format="yyyy-MM-dd" required="true"/>\n    </record>  \n  \n    <record name="contact" class="example.Contact" occurs="0+">\n      <field name="recordType" rid="true" literal="D" ignore="true" />\n      \x3c!-- \'maxLength\' enforces a maximum String length --\x3e\n      <field name="firstName" maxLength="20" />\n      <field name="lastName" required="true" maxLength="30" />\n      <field name="street" maxLength="30" />\n      <field name="city" maxLength="25" />\n      <field name="state" minLength="2" maxLength="2" />\n      \x3c!-- \'regex\' enforces pattern matching --\x3e\n      <field name="zip" regex="\\d{5}" />\n    </record>\n\n    <record name="trailer" target="recordCount" occurs="1">\n      <field name="recordType" rid="true" literal="T" />\n      <field name="recordCount" type="int" required="true" />\n    </record>  \n    \n  </stream>\n</beanio>\n')),Object(l.b)("p",null,"Prefer to annotate the ",Object(l.b)("inlineCode",{parentName:"p"},"Contact")," class instead?"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-java"},'package example;\n\n@Record(minOccurs=0, maxOccurs=-1)\n@Fields({\n    @Field(at=0, name="recordType", rid=true, literal="D")\n})\npublic class Contact {\n\n    @Field(at=1, maxLength=20)\n    String firstName;   \n    @Field(at=2, required=true, maxLength=30)\n    String lastName;\n    @Field(at=3, maxLength=30)\n    String street;\n    @Field(at=4, maxLength=25)\n    String city;\n    @Field(at=5, minLength=2, maxLength=2)\n    String state;\n    @Field(at=6, regex="\\d{5}")\n    String zip;\n    \n    // getters and setters not shown...\n')),Object(l.b)("p",null,"Need to support XML?  Simply change the stream ",Object(l.b)("inlineCode",{parentName:"p"},"format")," to 'xml', remove\nthe ",Object(l.b)("inlineCode",{parentName:"p"},"recordType")," fields, and presto!  You can now read and write documents\nlike the following:"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-xml"},"<contacts>\n  <header>\n    <fileDate>2012-05-19</fileDate>\n  </header>\n  <contact>\n    <firstName>Joe</firstName>\n    <lastName>Johnson</lastName>\n    <street>123 Main St</street>\n    <city>Chicago</city>\n    <state>IL</state>\n    <zip>60610</zip>\n  </contact>\n  <contact>\n    <firstName>Jane</firstName>\n    <lastName>Smith</lastName>\n    <street/>\n    <city/>\n    <state/>\n    <zip/>\n  </contact>\n  <trailer>\n    <recordCount>2</recordCount>\n  </trailer>\n</contacts>\n")),Object(l.b)("p",null,"But that's not all, check out the ",Object(l.b)("a",{parentName:"p",href:"reference-guide"},"reference guide"),"\nfor more information."))}b.isMDXComponent=!0}}]);