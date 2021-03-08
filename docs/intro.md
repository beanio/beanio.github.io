---
id: intro
title: Introduction to BeanIO
sidebar_label: Introduction
slug: /
---

**BeanIO** is an open source Java framework for marshalling and unmarshalling 
Java beans from a flat file, stream, or simple `String` object.

## Features

* Support for XML, CSV, delimited and fixed length stream formats
* XML, Java annotations or builder API based field mapping
* Configurable record ordering and grouping rules
* Object binding that spans multiple records
* Record identification by one or more field values, or by record length
* Common field validation rules with customizable error messages
* Extensible stream parsing and type handling
* <del>Integration with <a href="http://static.springsource.org/spring-batch/">Spring Batch</a></del>
* OSGi compatible

## A Quick Example

Let's suppose you want to read and write a CSV flat file of contact information
with the following record layout:

<table>
  <tr><th>&nbsp;</th><th>Field Name</th><th>Format</th></tr>
  <tr><td colspan="3"><i>Header Record</i></td></tr>
  <tr><td>0</td><td>Record Type</td><td>"H"</td></tr>
  <tr><td>1</td><td>File Date</td><td>Date (YYYY-MM-DD)</td></tr>
  <tr><td colspan="3"><i>Detail Record</i></td></tr>
  <tr><td>0</td><td>Record Type</td><td>"D"</td></tr>
  <tr><td>1</td><td>First Name</td><td>String</td></tr>
  <tr><td>2</td><td>Last Name</td><td>String</td></tr>
  <tr><td>3</td><td>Street</td><td>String</td></tr>
  <tr><td>4</td><td>City</td><td>String</td></tr>
  <tr><td>5</td><td>State</td><td>String</td></tr>
  <tr><td>6</td><td>Zip</td><td>String</td></tr>
  <tr><td colspan="3"><i>Trailer Record</i></td></tr>
  <tr><td>0</td><td>Record Type</td><td>"T"</td></tr>
  <tr><td>1</td><td>Detail Record Count</td><td>Integer</td></tr>        
</table>

A sample input file could look like this:

```
H,2012-05-19
D,Joe,Johnson,123 Main St,Chicago,IL,60610
D,Jane,Smith,,,,
D,Albert,Jackson,456 State St,Chicago,IL,60614
T,3
```

And let's suppose you want to bind detail records to the following Java class.

```java
package example;

public class Contact {
    String firstName;
    String lastName;
    String street;
    String city;
    String state;
    String zip;
    
    // getters and setters not shown...
}
```

BeanIO is configured using an XML mapping file.  A 2.0 mapping file named "contacts.xml"
(shown below) can be used to read and write our CSV contacts file.

```xml
<beanio xmlns="http://www.beanio.org/2012/03">

   <!-- 'format' identifies the type of stream -->
   <stream name="contacts" format="csv">
      <!-- 'class' binds the header record to a java.util.HashMap -->
      <record name="header" class="map">
         <!-- 'rid' indicates this field is used to identify the record -->
         <field name="recordType" rid="true" literal="H" />
         <!-- 'format' can be used to provide Date and Number formats -->
         <field name="fileDate" type="date" format="yyyy-MM-dd" />
      </record>

      <!-- Detail records are bound to example.Contact -->
      <record name="contact" class="example.Contact">
         <!-- 'ignore' indicates this field is not bound to a bean property -->
         <field name="recordType" rid="true" literal="D" ignore="true" />
         <field name="firstName" />
         <field name="lastName" />
         <field name="street" />
         <field name="city" />
         <field name="state" />
         <field name="zip" />
      </record>

      <!-- 'target' binds the trailer record to the Integer record count field -->
      <record name="trailer" target="recordCount">
         <!-- 'literal' is used to define constant values -->
         <field name="recordType" rid="true" literal="T" />
         <!-- 'type' can be declared where bean introspection is not possible -->
         <field name="recordCount" type="int" />
      </record>

   </stream>
</beanio>
```

Using the mapping file and bean object from above, the following code will read
and write our CSV contacts file. (For brevity, exception handling is lacking.)

```java
package example;

import org.beanio.*;
import java.io.*;

public class ExampleMain {

   public static void main(String[] args) throws Exception {
      // create a BeanIO StreamFactory
      StreamFactory factory = StreamFactory.newInstance();
      // load the mapping file from the working directory
      factory.load("contacts.xml");

      // create a BeanReader to read from "input.csv"
      BeanReader in = factory.createReader("contacts", new File("input.csv"));
      // create a BeanWriter to write to "output.csv"
      BeanWriter out = factory.createWriter("contacts", new File("output.csv"));

      Object record = null;

      // read records from "input.csv"
      while ((record = in.read()) != null) {

         // process each record
         if ("header".equals(in.getRecordName())) {
            Map<String, Object> header = (Map<String, Object>) record;
            System.out.println(header.get("fileDate"));
         } else if ("contact".equals(in.getRecordName())) {
            Contact contact = (Contact) record;
            // process the contact...
         } else if ("trailer".equals(in.getRecordName())) {
            Integer recordCount = (Integer) record;
            System.out.println(recordCount + " contacts processed");
         }

         // write the record to "output.csv"
         out.write(record);
      }

      in.close();

      out.flush();
      out.close();
   }
}
```

That's it! But of course, BeanIO supports many other cool
features. For example, if we wanted to strictly validate our contacts input
file, we could make the following additions to our mapping file.

```xml
<beanio xmlns="http://www.beanio.org/2012/03">

  <!-- 'strict' enforces record order and record sizes -->
  <stream name="contacts" format="csv" strict="true">
    <!-- 'occurs' enforces minimum and maximum record occurrences -->
    <record name="header" class="map" occurs="1">
      <field name="recordType" rid="true" literal="H" />
      <!-- 'required' indicates a field value is required -->
      <field name="fileDate" type="date" format="yyyy-MM-dd" required="true"/>
    </record>  
  
    <record name="contact" class="example.Contact" occurs="0+">
      <field name="recordType" rid="true" literal="D" ignore="true" />
      <!-- 'maxLength' enforces a maximum String length -->
      <field name="firstName" maxLength="20" />
      <field name="lastName" required="true" maxLength="30" />
      <field name="street" maxLength="30" />
      <field name="city" maxLength="25" />
      <field name="state" minLength="2" maxLength="2" />
      <!-- 'regex' enforces pattern matching -->
      <field name="zip" regex="\d{5}" />
    </record>

    <record name="trailer" target="recordCount" occurs="1">
      <field name="recordType" rid="true" literal="T" />
      <field name="recordCount" type="int" required="true" />
    </record>  
    
  </stream>
</beanio>
```

Prefer to annotate the `Contact` class instead?

```java
package example;

@Record(minOccurs=0, maxOccurs=-1)
@Fields({
    @Field(at=0, name="recordType", rid=true, literal="D")
})
public class Contact {

    @Field(at=1, maxLength=20)
    String firstName;	
    @Field(at=2, required=true, maxLength=30)
    String lastName;
    @Field(at=3, maxLength=30)
    String street;
    @Field(at=4, maxLength=25)
    String city;
    @Field(at=5, minLength=2, maxLength=2)
    String state;
    @Field(at=6, regex="\d{5}")
    String zip;
    
    // getters and setters not shown...
```

Need to support XML?  Simply change the stream `format` to 'xml', remove
the `recordType` fields, and presto!  You can now read and write documents
like the following:

```xml
<contacts>
  <header>
    <fileDate>2012-05-19</fileDate>
  </header>
  <contact>
    <firstName>Joe</firstName>
    <lastName>Johnson</lastName>
    <street>123 Main St</street>
    <city>Chicago</city>
    <state>IL</state>
    <zip>60610</zip>
  </contact>
  <contact>
    <firstName>Jane</firstName>
    <lastName>Smith</lastName>
    <street/>
    <city/>
    <state/>
    <zip/>
  </contact>
  <trailer>
    <recordCount>2</recordCount>
  </trailer>
</contacts>
```

But that's not all, check out the [reference guide](reference-guide)
for more information.
