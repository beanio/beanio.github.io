---
id: guide
title: Reference Guide
sidebar_label: Reference Guide
slug: /reference-guide
---

&copy; 2010-2022 Kevin Seim & BeanIO contributors

_Copies of this document may be made for your own use and for distribution to others, provided that you do not charge
any fee for such copies and further provided that each copy contains this Copyright Notice, whether distributed in print
or electronically._

## 1.0. Introduction

BeanIO is an open source Java framework for reading and writing Java objects from a flat file, stream, or any String
input. BeanIO is well suited for batch processing, and currently supports XML, CSV, delimited and fixed length file
formats. BeanIO is licensed under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).

### 1.1. What's new in 3.0?

BeanIO 3.0 is the continuation of the BeanIO 2.x series. Because the original maintainer wasn't working on BeanIO
anymore and seemed to be unreachable, we decided to fork the project and host it on GitHub Pages instead of
beanio.org. Version 3.0 brings new exciting features like: 

* support for `java.time` types such as `LocalDateTime` and `ZonedDateTime`
* `BeanWriter` now implements `AutoCloseable` to be used in try-with-resources
* `BeanReader` now implements `Closeable` to be used in try-with-resources
* an `Automatic-Module-Name` was added to `MANIFEST.MF` for BeanIO to be compatible with the Java Platform Module System

### 1.2. Migrating from 2.x to 3.0

Release 3.0 is almost backwards compatible with prior 2.x releases, with the following exceptions:

* a JDK 1.8+ is now required
* the Maven `groupId` changed from `org.beanio` to `com.github.beanio`

## 2.0. Getting Started

To get started with BeanIO, add `beanio.jar` to your application's classpath.

In Maven projects:

```xml
<dependency>
    <groupId>com.github.beanio</groupId>
    <artifactId>beanio</artifactId>
    <version>3.0.0</version>
</dependency>
```

In Gradle projects:

```groovy
implementation 'com.github.beanio:beanio:3.0.0'
```

BeanIO requires a version 1.8 JDK or higher. In order to process XML formatted streams, BeanIO also requires an XML
parser based on the Streaming API for XML (StAX), as specified by [JSR 173](http://www.jcp.org/en/jsr/detail?id=173).
JDK 1.6 and higher includes a StAX implementation and therefore does not require any additional libraries.

### 2.1. My First Stream

This section explores a simple example that uses BeanIO to read and write a flat file containing employee data. Let's
suppose the file is in CSV format and has the following record layout:

<div className="indent">
  <table>
    <tbody>
    <tr><th>Position</th><th>Field</th><th>Format</th></tr>
    <tr><td>0</td><td>First Name</td><td>Text</td></tr>
    <tr><td>1</td><td>Last Name</td><td>Text</td></tr>
    <tr><td>2</td><td>Job Title</td><td>Text</td></tr>
    <tr><td>3</td><td>Salary</td><td>Number</td></tr>
    <tr><td>4</td><td>Hire Date</td><td>Date (MMDDYYYY)</td></tr>
    </tbody>
  </table>
</div>

A sample file is shown below.

```
Joe,Smith,Developer,75000,10012009
Jane,Doe,Architect,80000,01152008
Jon,Anderson,Manager,85000,03182007
```

Next, let's suppose we want to read records into the following Java bean for further processing. Remember that a Java
bean must have a default no-argument constructor and public getters and setters for all exposed properties.

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    
    // getters and setters not shown...
}
```

BeanIO uses an XML configuration file, called a mapping file, to define how bean objects are bound to records. Below is
a mapping file, named `mapping.xml`, that could be used to read the sample employee file and unmarshall records
into `Employee` objects. The same mapping file can be used to write, or marshall, `Employee` objects to a file or output
stream.

```xml
<beanio xmlns="http://www.beanio.org/2012/03" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
    </record>
  </stream>
</beanio>
```

To read the employee CSV file, a `StreamFactory` is used to load our mapping file and create a new `BeanReader`
instance. The `BeanReader` is used to unmarshall `Employee` objects from the file `employee.csv`. (For the sake of
brevity, proper exception handling is not shown.)
```java
package example;

import org.beanio.*;
import java.io.*;

public class BeanReaderExample {
    public static void main(String[] args) throws Exception {
        // create a StreamFactory
        StreamFactory factory = StreamFactory.newInstance();
        // load the mapping file
        factory.load("mapping.xml");
        
        // use a StreamFactory to create a BeanReader
        try (BeanReader in = factory.createReader("employeeFile", new File("employee.csv"))) {
            Employee employee;
            while ((employee = (Employee) in.read()) != null) {
                // process the employee...
            }
        }
    }
}
```

To write an employee CSV file, the same `StreamFactory` class is used to create a `BeanWriter` for
marshalling `Employee` bean objects to the file `employee.csv`. In this example, the same mapping configuration file is
used for both reading and writing an employee file.

```java
package example;

import org.beanio.*;
import java.io.*;
import java.util.*;

public class BeanWriterExample {
    public static void main(String[] args) throws Exception {
        // create a StreamFactory
        StreamFactory factory = StreamFactory.newInstance();
        // load the mapping file
        factory.load("mapping.xml");
        
        Employee employee = new Employee();
        employee.setFirstName("Jennifer");
        employee.setLastName("Jones");
        employee.setTitle("Marketing")
        employee.setSalary(60000);
        employee.setHireDate(new Date());
        
        // use a StreamFactory to create a BeanWriter
        try (BeanWriter out = factory.createWriter("employeeFile", new File("employee.csv"))) {
            // write an Employee object directly to the BeanWriter
            out.write(employee);
            out.flush();
        }
    }
}
```

Running `BeanWriterExample` produces the following CSV file.

```
Jennifer,Jones,Marketing,60000,01012011
```

## 3.0. Core Concepts

### 3.1. BeanReader

The [`org.beanio.BeanReader`](https://beanio.github.io/api/org/beanio/BeanReader.html) interface, shown below, is used
to read bean objects from an input stream. The `read()` method returns an unmarshalled bean object for the next record
or group of records read from the input stream. When the end of the stream is reached, `null` is returned.

The method `setErrorHandler(...)` can be used to register a custom error handler. If an error handler is not
configured, `read()` simply throws the unhandled exception.

The method `getRecordName()` returns the name of the record (or group) mapped to the most recent bean object read from
the input stream, as declared in the mapping file. And `getLineNumber()` returns the line number of the first record
mapped to the most recent bean object read from the input stream. Additional information is available about records read
from the stream by calling `getRecordCount` and `getRecordContext`. Please consult the API documentation for further
information.

Before discarding a `BeanReader`, `close()` should be invoked to close the underlying input stream.

```java
package org.beanio;

public interface BeanReader {

    public Object read() throws BeanReaderException;
    
    public int getLineNumber();
    
    public String getRecordName();
    
    public int getRecordCount();
    
    public RecordContext getRecordContext(int index); 
    
    public int skip(int count) throws BeanReaderException;
    
    public void close() throws BeanReaderIOException;
    
    public void setErrorHandler(BeanReaderErrorHandler errorHandler);
}
```

### 3.2. BeanWriter

The [`org.beanio.BeanWriter`](https://beanio.github.io/api/org/beanio/BeanWriter.html) interface, shown below, is used
to write bean objects to an output stream. Calling the `write(Object)` method marshals a bean object to the output
stream. In some cases where multiple record types are not discernible by class type or record identifying fields,
the `write(String,Object)` method can be used to explicitly name the record type to marshal.

Before discarding a `BeanWriter`, `close()` should be invoked to close the underlying output stream.

```java
package org.beanio;

public interface BeanWriter {

    public void write(Object bean) throws BeanWriterException;
    
    public void write(String recordName, Object bean) throws BeanWriterException;
    
    public void flush() throws BeanWriterIOException;
    
    public void close() throws BeanWriterIOException;
}
```
### 3.3. Unmarshaller

The [`org.beanio.Unmarshaller`](https://beanio.github.io/api/org/beanio/Unmarshaller.html) interface, shown below, is
used to unmarshal a bean object from a `String` record.

```java
package org.beanio;

public interface Unmarshaller {

    // For all stream formats
    public Object unmarshal(String record) throws BeanReaderException;
    
    // For CSV and delimited formatted streams
    public Object unmarshal(List<String> fields) throws BeanReaderException;
    public Object unmarshal(String[] fields) throws BeanReaderException;

    // For XML formatted streams
    public Object unmarshal(Node node) throws BeanReaderException;
    
    public String getRecordName();
    
    public RecordContext getRecordContext();
}
```
### 3.4. Marshaller

The [`org.beanio.Marshaller`](https://beanio.github.io/api/org/beanio/Marshaller.html) interface, shown below, is used
to marshal a bean object into a `String` record.

```java
package org.beanio;

public interface Marshaller {

    public Marshaller marshal(Object bean) throws BeanWriterException;
    
    public Marshaller marshal(String recordName, Object bean) throws BeanWriterException;
    
    // For all stream formats
    public String toString();
    
    // For CSV and delimited formatted streams
    public String[] toArray() throws BeanWriterException;
    public List<String> toList() throws BeanWriterException;
    
    // For XML formatted streams
    public Document toDocument() throws BeanWriterException;
}
```

Marshalling a single bean object to record text is now as simple as:

```
String recordText = marshaller.marshal(object).toString();
```

### 3.5. Mapping Files

BeanIO uses XML configuration files, called mapping files, to bind a stream layout to bean objects. Multiple layouts can
be configured in a single mapping file using `stream` elements. Each stream is assigned a unique name for referencing
the layout. In addition to its name, every stream must declare its format using the `format` attribute. Supported stream
formats include `csv`, `delimited`, `fixedlength`, and `xml`. Mapping files are fully explained in the next
section ([4.0. The Mapping File](#TheMappingFile)).

```xml
<beanio xmlns="http://www.beanio.org/2012/03" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <stream name="stream1" format="csv"... >
    <!-- record layout... -->
  </stream>
  
  <stream name="stream2" format="fixedlength"... >
    <!-- record layout... -->
  </stream>
    
</beanio>
```

### 3.6. StreamFactory

The [`org.beanio.StreamFactory`](https://beanio.github.io/api/org/beanio/StreamFactory.html) class is used to load
mapping files and create `BeanReader`, `BeanWriter`, `Marshaller` and `Unmarshaller` instances. The following code
snippet shows how to instantiate a `StreamFactory`, load a mapping file and create the various BeanIO parsers.
The `load(...)` method loads mapping files from the file system (relative to the current working directory), while the
method `loadResource(...)` loads mapping files from the classpath.

```java
// create a StreamFactory
StreamFactory factory = StreamFactory.newInstance();
// load 'mapping-1.xml' from the current working directory
factory.load("mapping-1.xml");
// load 'mapping-2.xml' from the classpath
factory.loadResource("mapping-2.xml");'

// create a BeanReader to read from 'in.txt'
Reader in = new BufferedReader(new FileReader("in.txt"));
BeanReader beanReader = factory.createReader("streamName", in);

// create a BeanWriter to write to 'out.txt'
Writer out = new BufferedWriter(new FileWriter("out.txt"));
BeanWriter beanWriter = factory.createWriter("streamName", out);

// create an Unmarshaller to unmarshal bean objects from record text
Unmarshaller unmarshaller = factory.createUnmarshaller("streamName");

// create a Marshaller to marshal bean objects to record text
Marshaller marshaller = factory.createMarshaller("streamName");
```

### 3.7. Exception Handling

All BeanIO exceptions extend from `BeanIOException`, which extends from `RuntimeException` so that exceptions do not
need to be explicitly caught unless desired. `BeanReaderException` and `BeanWriterException` extend
from `BeanIOException` and may be thrown by a `BeanReader` or `BeanWriter` respectively.

A `BeanReaderException` is further broken down into the following subclasses thrown by the `read()` method.

<div className="indent">
<table>
<tbody>
<tr><th>Exception</th><th>Description</th></tr>

<tr>
  <td><code>BeanReaderIOException</code></td>
  <td>Thrown when the underlying input stream throws an <code>IOException</code>.</td>
</tr>
<tr>
  <td><code>MalformedRecordException</code></td>
  <td>
    Thrown when the underlying input stream is malformed based on the configured
    stream format, and therefore a record could not be accurately read from the
    stream.  In many cases, further reads from the input stream will be unsuccessful.
  </td>
</tr>
<tr>
  <td><code>UnidentifiedRecordException</code></td>
  <td>
    Thrown when a record does not match any record definition configured in the 
    mapping file.  If the stream layout does not strictly enforce record
    sequencing, further reads from the input stream are likely to be successful.
  </td>
</tr>
<tr>
  <td><code>UnexpectedRecordException</code></td>
  <td>
    Thrown when a record is read out of order.  Once record sequencing is violated,
    further reads from the input stream are likely to be unsuccessful.
  </td>
</tr>
<tr>
  <td><code>InvalidRecordException</code></td>
  <td>
    Thrown when a record is matched, but the record is invalid for one of the following
    reasons:
    <ul>
      <li>A record level validation failed</li>
      <li>One or more field level validations failed</li>
      <li>Field type conversion failed</li>
    </ul>
    This exception has no effect on the state of the <code>BeanReader</code> and further reads 
    from the input stream can be safely performed.
  </td>
</tr>
<tr>
  <td><code>InvalidRecordGroupException</code></td>
  <td>
    Extends from <code>InvalidRecordException</code> and is thrown when one or more records in a group 
    (that are mapped to a single bean object) are invalid.  This exception has no effect on the state of the <code>BeanReader</code> and further reads 
    from the input stream can be safely performed.
  </td>
</tr>
<tr>
  <td><code>BeanReaderException</code></td>
  <td>Thrown directly in a few rare unrecoverable scenarios.</td>
</tr>
</tbody>
</table>
</div>

When a `BeanReaderException` is thrown, information about the failed record(s) can be accessed by
calling `exception.getRecordContext()` to obtain a `org.beanio.RecordContext`. Please refer to the API javadocs for more
information.

```java
package org.beanio;

public interface RecordContext {
    public int getLineNumber();
    public String getRecordText();
    public String getRecordName();
    public boolean hasErrors();
    public boolean hasRecordErrors();
    public Collection<String> getRecordErrors();
    public String getFieldText(String fieldName);
    public String getFieldText(String fieldName, int index);
    public boolean hasFieldErrors();
    public Map<String, Collection<String>> getFieldErrors();
    public Collection<String> getFieldErrors(String fieldName);
}
```
#### 3.7.1. BeanReaderErrorHandler

If you need to handle an exception and continue processing, it may be simpler to register a `BeanReaderErrorHandler`
using the `beanReader.setErrorHandler()` method. The `BeanReaderErrorHandler` interface is shown below. Any exception
thrown by the error handler will be rethrown by the `BeanReader`.

```java
package org.beanio;

public interface BeanReaderErrorHandler {
    public void handleError(BeanReaderException ex) throws Exception;
}
```

The following example shows how invalid records could be written to a reject file by registering an error handler
extending `BeanReaderErrorHandlerSupport`, a subclass of `BeanReaderErrorHandler`. All other exceptions are left
uncaught and will bubble up to the calling method.

```java
    BeanReader input;
    BufferedWriter rejects;
    try {
        input.setErrorHandler(new BeanReaderErrorHandlerSupport() {
            public void invalidRecord(InvalidRecordException ex) throws Exception {
                // if a bean object is mapped to a record group,
                // the exception may contain more than one record
            	for (int i=0, j=ex.getRecordCount(); i<j; i++) {
                    rejects.write(ex.getRecordContext(i).getRecordText());
                    rejects.newLine();
                }
            }
        });
        
        Object record = null;
        while ((record = input.read()) != null) {
            // process a valid record
        }
        
        rejects.flush();
    }
    finally {
        input.close();
        rejects.close();
    }
```

## 4.0. Stream Components

This section covers the basic components used by BeanIO to map an input stream or String to Java objects. All examples
are shown using a mapping file, but the concepts (and most attributes) are the same whether using the stream builder
API, mapping file, Java annotations, or any combination thereof.

### 4.1. Streams

A typical mapping file contains one or more stream layouts. A `stream` must have a `name` and `format` attribute
configured. The name of the stream is used to reference the layout when creating a parser using a `StreamFactory`. And
the format instructs BeanIO how to interpret the stream. Supported formats include `xml`, `csv`, `delimited`
and `fixedlength`.

```xml
<beanio xmlns="http://www.beanio.org/2012/03" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <stream name="stream1" format="csv"... >
    <!-- record layout... -->
  </stream>
  
  <stream name="stream2" format="fixedlength"... >
    <!-- record layout... -->
  </stream>
    
</beanio>
```

BeanIO parses (and formats) a record from a stream or text using a record parser generated by a `RecordParserFactory`.
BeanIO allows you to create and customize your own `RecordParserFactory`, but in most cases you can simply configure
BeanIO's default record parser factory using a stream's `parser` element. The `parser` element allows you to set format
specific properties on a `RecordParserFactory`. For example, the following stream layout changes the delimiter to a pipe
for the delimited stream 's1':

```xml
<beanio xmlns="http://www.beanio.org/2012/03" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <stream name="s1" format="delimited">
    <parser>
      <property name="delimiter" value="|" />
    </parser>
    <!-- record layout... -->
  </stream>
  
</beanio>
```
The next few sections list available parser properties for each stream format.

#### 4.1.1. CSV Streams

CSV formatted streams are parsed according to [RFC 4180](http://www.ietf.org/rfc/rfc4180.txt) with one exception:
multi-line records are disabled (but this can be overridden).

The following properties can be used to customize default CSV parsers:

<table className="indent">
<tbody>
<tr>
  <th>Property Name</th>
  <th>Type</th>
  <th>Description</th>
  <th>Affects</th>
</tr>
<tr>
  <td><code>delimiter</code></td>
  <td>char</td>
  <td>The field delimiter.  Defaults to a comma.</td>
  <td>*</td>
</tr>
<tr>
  <td><code>quote</code></td>
  <td>char</td>
  <td>The quotation mark character used to wrap fields containing a delimiter character, a
    quotation mark, or new lines.  Defaults to the double quotation mark, ".</td>
  <td>*</td>
</tr>
<tr>
  <td><code>escape</code></td>
  <td>Character</td>
  <td>The character used to escape a quotation mark in a quoted field.  Defaults to the
    double quotation mark, ".</td>
  <td>*</td>
</tr>
<tr>
  <td><code>comments</code></td>
  <td>String[]</td>
  <td>A comma separated list of values for identifying commented lines.  If a line read from an input
    stream begins with any of the configured values, the line is ignored.  A backslash may
    be used to escape a comma and itself.  All whitespace is preserved.
    <p>Enabling comments require the input reader passed to <code>StreamFactory</code> to support marking.
    Among others, Java's <code>BufferedReader</code> and <code>StringReader</code> support marking.</p></td>
  <td><code>BeanReader</code></td>
</tr>
<tr>
  <td><code>multilineEnabled</code></td>
  <td>boolean</td>
  <td>If set to <code>true</code>, quoted fields may contain new line characters.  Defaults to <code>false</code>.</td>
  <td><code>BeanReader</code></td>
</tr>
<tr>
  <td><code>whitespaceAllowed</code></td>
  <td>boolean</td>
  <td>
  If set to <code>true</code>, whitespace is ignored and allowed before and after 
  quoted values.  For example, the following is allowed:
  <pre>Jennifer, "Jones" ,24</pre>
  Defaults to <code>false</code>.
  </td>
  <td><code>BeanReader, Unmarshaller</code></td>
</tr>
<tr>
  <td><code>unquotedQuotesAllowed</code></td>
  <td>boolean</td>
  <td>
    If set to <code>true</code>, field text containing quotation marks do not need to 
    be quoted unless the field text starts with a quotation mark.  For example, the
    following is allowed:
    <pre>Jennifer,She said "OK"</pre>
    Defaults to <code>false</code>.
  </td>  
  <td><code>BeanReader, Unmarshaller</code></td>
</tr>
<tr>
  <td><code>recordTerminator</code></td>
  <td>String</td>
  <td>The character used to signify the end of a record.  By default, any new line character
    (line feed (LF), carriage return (CR), or CRLF combination) is accepted when reading
    an input stream, and <code>System.getProperty("line.separator")</code> is used when writing
    to a stream.</td>
  <td><code>BeanWriter</code></td>
</tr>
<tr>
  <td><code>alwaysQuote</code></td>
  <td>boolean</td>
  <td>If set to <code>true</code>, field text is always quoted.  By default, a field is only quoted
  if it contains a delimeter, a quotation mark or new line characters.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
</tbody>
</table>

#### 4.1.2. Delimited Streams

The default delimited parsers can be customized using the following properties:

<table className="indent">
<tbody>
<tr>
  <th>Property Name</th>
  <th>Type</th>
  <th>Description</th>
  <th>Affects</th>
</tr>
<tr>
  <td><code>delimiter</code></td>
  <td>char</td>
  <td>The field delimiter.  Defaults to the tab character.</td>
  <td>*</td>
</tr>
<tr>
  <td><code>escape</code></td>
  <td>Character</td>
  <td>The escape character allowed to escape a delimiter or itself.  By default, escaping
    is disabled.</td>
  <td>*</td>
</tr>
<tr>
  <td><code>lineContinuationCharacter</code></td>
  <td>Character</td>
  <td>If this character is the last character before a new line or carriage return is read,
    the record will continue reading from the next line.  By default, line continuation
    is disabled.</td>
  <td><code>BeanReader</code></td>
</tr>
<tr>
  <td><code>recordTerminator</code></td>
  <td>Character</td>
  <td>The character used to signify the end of a record.  By default, any new line character
    (line feed (LF), carriage return (CR), or CRLF combination) is accepted when reading
    an input stream, and <code>System.getProperty("line.separator")</code> is used when writing
    to a stream.</td>
  <td><code>BeanReader, BeanWriter</code></td>
</tr>
<tr>
  <td><code>comments</code></td>
  <td>String[]</td>
  <td>A comma separated list of values for identifying commented lines.  If a line read from an input
    stream begins with any of the configured values, the line is ignored.  A backslash may
    be used to escape a comma and itself.  All whitespace is preserved.
    <p>Enabling comments require the input reader passed to <code>StreamFactory</code> to support marking.
    Among others, Java's <code>BufferedReader</code> and <code>StringReader</code> support marking.</p></td>
  <td><code>BeanReader</code></td>
</tr>
</tbody>
</table>


#### 4.1.3. Fixed Length Streams

The default fixed length parsers can be customized using the following properties:

<table className="indent">
<tbody>
<tr>
  <th>Property Name</th>
  <th>Type</th>
  <th>Description</th>
  <th>Affects</th>
</tr>
<tr>
  <td><code>lineContinuationCharacter</code></td>
  <td>Character</td>
  <td>If this character is the last character before a new line or carriage return is read,
    the record will continue reading from the next line.  By default, line continuation
    is disabled.</td>
  <td><code>BeanReader</code></td>
</tr>
<tr>
  <td><code>recordTerminator</code></td>
  <td>Character</td>
  <td>The character used to signify the end of a record.  By default, any new line character
    (line feed (LF), carriage return (CR), or CRLF combination) is accepted when reading
    an input stream, and <code>System.getProperty("line.separator")</code> is used when writing
    to a stream.</td>
  <td><code>BeanReader, BeanWriter</code></td>
</tr>
<tr>
  <td><code>comments</code></td>
  <td>String[]</td>
  <td>A comma separated list of values for identifying commented lines.  If a line read from an input
    stream begins with any of the configured values, the line is ignored.  A backslash may
    be used to escape a comma and itself.  All whitespace is preserved.
    <p>Enabling comments require the input reader passed to <code>StreamFactory</code> to support marking.
    Among others, Java's <code>BufferedReader</code> and <code>StringReader</code> support marking.</p></td>
  <td><code>BeanReader</code></td>
</tr>
</tbody>
</table>

#### 4.1.4. XML Streams

The default XML parsers can be customized using the following properties:

<table className="indent">
<tbody>
<tr>
  <th>Property Name</th>
  <th>Type</th>
  <th>Description</th>
  <th>Affects</th>
</tr>
<tr>
  <td><code>suppressHeader</code></td>
  <td>boolean</td>
  <td>If set to <code>true</code>, the XML header is suppressed in the marshalled
  document.  Defaults to <code>false</code>.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
<tr>
  <td><code>version</code></td>
  <td>String</td>
  <td>The XML header version.  Defaults to <code>1.0</code>.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
<tr>
  <td><code>encoding</code></td>
  <td>String</td>
  <td>The XML header encoding.  Defaults to 
    <code>utf-8</code>.  Note that this setting has no bearing on the actual
    encoding of the output stream.  If set to "", an encoding attribute
    is not included in the header.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
<tr>
  <td><code>namespaces</code></td>
  <td>String</td>
  <td>A space delimited list of XML prefixes and namespaces to declare
    on the root element of a marshalled document.  The property value
    should be formatted as
    <pre className="indent">prefix1 namespace1 prefix2 namespace2...</pre></td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
<tr>
  <td><code>indentation</code></td>
  <td>Integer</td>
  <td>The number of spaces to indent each level of XML.  By default, indentation
    is disabled using a value of -1.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
<tr>
  <td><code>lineSeparator</code></td>
  <td>String</td>
  <td>The character(s) used to separate lines when indentation is enabled. 
    By default, <code>System.getProperty("line.separator")</code> is used.</td>
  <td><code>BeanWriter, Marshaller</code></td>
</tr>
</tbody>
</table>

### 4.2. Records

Each record type read from an input stream or written to an output stream must be mapped using a `record` element. A
stream mapping must include at least one record. A record mapping is used to validate the record and bind field values
to a bean object. A simple record configuration is shown below.

```xml
<beanio>

  <stream name="stream1" format="csv">
    <record name="record1" class="example.Record">
      <field name="firstName" />
      <field name="lastName" />
      <field name="age" />
    </record>
  </stream>
  
</beanio>
```

In this example, a CSV formatted stream is mapped to a single record composed of three fields: first name, last name and
age. When a record is read from a stream using a `BeanReader`, the class `example.Record` is instantiated and
its `firstName`, `lastName` and `age` attributes are set using standard Java bean setter naming conventions (
e.g. `setFirstName(String)`).

Similarly, when a `example.Record` bean object is written to an output stream using a `BeanWriter`, its `firstName`
, `lastName` and `age` attributes are retrieved from the bean object using standard Java bean getter naming
conventions (e.g. `getFirstName()`).

BeanIO also supports Map based records by setting a record's `class` attribute to `map`, or to the fully qualified class
name of any class assignable to `java.util.Map`. Note that if you plan to use Map based records, field types may need be
explicitly configured using the `type` attribute, or BeanIO will assume the field is of type `java.lang.String`
The `type` attribute is further explained in section [4.6. Field Type Conversion](#FieldTypeConversion.).

```xml
<beanio>

  <stream name="stream1" format="csv">
    <record name="record1" class="map">
      <field name="firstName" />
      <field name="lastName" />
      <field name="age" type="int"/>
    </record>
  </stream>
  
</beanio>
```

#### 4.2.1. Record Identification

Oftentimes, a stream is made up of multiple record types. A typical batch file may include one header, one trailer, and
zero to many detail records. BeanIO allows a record to be identified by one or more of its fields using expected literal
values or regular expressions. If desired, BeanIO can be used to validate the order of all records in the input stream.

To see how a stream can be configured to handle multiple record types, let's modify our Employee file to include a
header and trailer record as shown below. Each record now includes a record type field that identifies the type of
record.

```
Header,01012011
Detail,Joe,Smith,Developer,75000,10012009
Detail,Jane,Doe,Architect,80000,01152008
Detail,Jon,Anderson,Manager,85000,03182007
Trailer,3
```

The mapping file can now be updated as follows:

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="header" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" format="MMddyyyy" />
    </record>
    <record name="employee" minOccurs="0" maxOccurs="unbounded" class="example.Employee">
      <field name="recordType" rid="true" literal="Detail" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
    </record>
    <record name="trailer" minOccurs="1" maxOccurs="1" class="example.Trailer">
      <field name="recordType" rid="true" literal="Trailer" />
      <field name="recordCount" />
    </record>  
  </stream>
  
</beanio>
```

There are several new record and field attributes introduced in this mapping file, so we'll explain each new attribute
in turn.

First, a field used to identify a record must be configured as a _record identifier_ using `rid="true"`. There is no
limitation to the number of fields that can be used to identify a record, but all fields where `rid="true"` must be
satisfied before a record is identified. If there is no field configured as a record identifier, by default the record
will always match.

```xml
    <record name="header" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" />
    </record>
```

Second, all record identifying fields must have a matching validation rule configured. In our example, the literal
value `Header` in the record type field is used to identify the header record. Literal values must match exactly and can
be configured using the `literal` field attribute. Alternatively, record identifying fields may use a regular expression
to match field text using the `regex` field attribute.

```xml
    <record name="header" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" />
    </record>
```

Third, each record defines the minimum and maximum number of times it may repeat using the attributes `minOccurs`
and `maxOccurs`. Based on our configuration, exactly one header and trailer record is expected, while the number of
detail records is unbounded.

```xml
    <record name="header" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" />
    </record>
```

If `minOccurs` and/or `maxOccurs` are not set, the minimum occurrences of a record defaults to 0 and maximum occurrences
is unbounded.

Its also possible to identify delimited and fixed length records based on their length. The `ridLength` record attribute
can be used to specify a range of lengths to identify the record.

#### 4.2.2. Record Ordering

As explained in the previous section, a stream can support multiple record types. By default, a `BeanReader` will read
records in any order. But if desired, BeanIO can enforce record ordering using an `order` attribute on each record.
The `order` attribute can be assigned any positive integer value greater than 0. Records that are assigned the same
number may be read from the stream in any order. If `order` is set for one record, it must be set for all other
records (and groups) that share the same parent.

In our previous example, if we want enforce that the header record is the first record in the file, the trailer is the
last, and all detail records appear in the middle, the mapping file could be changed as follows. Using this
configuration, if a detail record were to appear before the header record, the `BeanReader` will throw
an `UnexpectedRecordException` when the detail record is read out of order.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="header" order="1" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" format="MMddyyyy" />
    </record>
    <record name="employee" order="2" minOccurs="0" maxOccurs="unbounded" class="example.Employee">
      <field name="recordType" rid="true" literal="Detail" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
    </record>
    <record name="trailer" order="3" minOccurs="1" maxOccurs="1" class="example.Trailer">
      <field name="recordType" rid="true" literal="Trailer" />
      <field name="recordCount" />
    </record>  
  </stream>
  
</beanio>
```

#### 4.2.3. Record Grouping

In some cases, a stream may be further divided into batches or groups of records. Continuing with our employee file,
lets suppose employee detail records are batched by department, where each group of employees has a department header
and a department trailer record. Thus an input file may look something like this:

```
Header,01012011
DeptHeader,Development
Detail,Joe,Smith,Developer,75000,10012009
Detail,Jane,Doe,Architect,80000,01152008
DeptTrailer,2
DeptHeader,Product Management
Detail,Jon,Anderson,Manager,85000,03182007
DeptTrailer,1
Trailer,2
```

BeanIO allows you to define groups of records using a `group` element to wrap the record types that belong to the group.
Groups support the same `order`, `minOccurs`, and `maxOccurs` attributes, although there meaning is applied to the
entire group. Once a record type is matched that belongs to a group, all other records in that group where `minOccurs`
is greater that 1, must be read from the stream before the group may repeat or a different record can be read. Our
mapping file would now look like this:

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="header" order="1" minOccurs="1" maxOccurs="1" class="example.Header">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" format="MMddyyyy" />
    </record>
    <group name="departmentGroup" order="2" minOccurs="0" maxOccurs"unbounded">
      <record name="deptHeader" order="1" minOccurs="1" maxOccurs="1" class="example.DeptHeader">
        <field name="recordType" rid="true" literal="DeptHeader" />
        <field name="departmentName" />
      </record>
      <record name="employee" order="2" minOccurs="0" maxOccurs="unbounded" class="example.Employee">
        <field name="recordType" rid="true" literal="Detail" />
        <field name="firstName" />
        <field name="lastName" />
        <field name="title" />
        <field name="salary" />
        <field name="hireDate" format="MMddyyyy" />
      </record>
      <record name="deptTrailer" order="3" minOccurs="1" maxOccurs="1" class="example.DeptTrailer">
        <field name="recordType" rid="true" literal="DeptTrailer" />
        <field name="employeeCount" />
      </record>  
    </group>
    <record name="trailer" order="3" minOccurs="1" maxOccurs="1" class="example.Trailer">
      <field name="recordType" rid="true" literal="Trailer" />
      <field name="departmentCount" />
    </record>  
  </stream>
  
</beanio>
```

The stream definition itself is a record group with defaults `minOccurs="0"` and `maxOccurs="1"`. If you want
your `BeanReader` to throw an exception if the stream is empty, simply change `minOccurs` to `1`, or if you want to
allow the entire stream to repeat indefinitely, simply change `maxOccurs` to `unbounded` as shown below.

```xml
<beanio>

  <stream name="employeeFile" format="csv" minOccurs="1" maxOccurs="unbounded">
    <!-- Record layout... -->
  </stream>
  
</beanio>
```

### 4.3. Fields

A record is made up of one or more fields, which are validated and bound to bean properties using the `field` element.
All fields must specify a `name` attribute, which by default, is used to get and set the field value from the bean
object.

Default getter and setter methods can be overridden using `getter` and `setter` attributes as shown below. If a field is
a constructor argument, `setter` can be set to '#N' where N is the position of the argument in the constructor starting
at 1 (not shown).

```xml
<beanio>

  <stream name="stream1" format="csv">
    <record name="record1" class="example.Record">
      <field name="firstName" />
      <field name="lastName" setter="setSurname" getter="getSurname"/>
      <field name="age" />
    </record>
  </stream>
  
</beanio>
```

Fields found in a stream that do not map to a bean property can be declared using the `ignore` field attribute. Note
that any configured validation rules are still applied to ignored fields (not shown).

```xml
<beanio>

  <stream name="stream1" format="csv">
    <record name="record1" class="example.Record">
      <field name="firstName" />
      <field name="lastName" />
      <field name="age" />
      <field name="filler" ignore="true" />
    </record>
  </stream>
  
</beanio>
```

By default, BeanIO expects fields to appear in a CSV, delimited or fixed length stream in the same order they are
declared in the mapping file. If this is not the case, a `position` field attribute can be configured for each field. If
a position is declared for one field, a position must be declared for all other fields in the same record. For
delimited (and CSV) formatted streams, `position` should be set to the index of the first occurrence of the field in the
record, beginning at 0. For fixed length formatted streams, `position` should be set to the index of the first character
of the first occurrence of the field in the record, beginning at 0. A negative position can be used to specify a field
location relative to the end of the record. For example, a position of -2 indicates the second to last field in a
delimited record.

The following example shows how the position attribute can be used. Although the fields are declared in a different
order, the record definition is identical to the previous example. When positions are explicitly configured for an input
stream, there is no need to declare all fields in a record, unless desired for validation purposes.

```xml
<beanio>

  <stream name="stream1" format="csv">
    <record name="record1" class="example.Record">
      <field name="filler" position="3" ignore="true" />
      <field name="lastName" position="1" />
      <field name="age" position="2"/>
      <field name="firstName" position="0" />
    </record>
  </stream>
  
</beanio>
```

#### 4.3.1. Field Type Conversion

The property type of a field is determined by introspecting the bean object the field belongs to. If the bean class is
of type `java.util.Map` or `java.util.Collection`, BeanIO will assume the field is of type `java.lang.String`, unless a
field type is explicitly declared using a field's `type` attribute.

The `type` attribute may be set to any fully qualified class name or to one of the supported type aliases below. Type
aliases are not case sensitive, and the same alias may be used for primitive types. For example, `int`
and `java.lang.Integer` bean properties will use the same type handler registered for the type `java.lang.Integer`, or
alias `integer` or `int`.

<table className="indent">
<tbody>
<tr><th>Class Name</th><th>Primitive</th><th>Alias(es)</th></tr>
<tr><td>java.lang.String</td><td>-</td><td><code>string</code></td></tr>
<tr><td>java.lang.Boolean</td><td>boolean</td><td><code>boolean</code></td></tr>
<tr><td>java.lang.Byte</td><td>byte</td><td><code>byte</code></td></tr>
<tr><td>java.lang.Character</td><td>char</td><td><code>character</code><br /><code>char</code></td></tr>
<tr><td>java.lang.Short</td><td>short</td><td><code>short</code></td></tr>
<tr><td>java.lang.Integer</td><td>int</td><td><code>integer</code><br /><code>int</code></td></tr>
<tr><td>java.lang.Long</td><td>long</td><td><code>long</code></td></tr>
<tr><td>java.lang.Float</td><td>float</td><td><code>float</code></td></tr>
<tr><td>java.lang.Double</td><td>double</td><td><code>double</code></td></tr>
<tr><td>java.math.BigInteger</td><td>-</td><td><code>biginteger</code></td></tr>
<tr><td>java.math.BigDecimal</td><td>-</td><td><code>bigdecimal</code><br /><code>decimal</code></td></tr>
<tr>
  <td>java.util.Date<sup>1</sup></td>
  <td>-</td>
  <td>
    <code>datetime</code><br />
    <code>date</code><br />
    <code>time</code>
  </td>
</tr>
<tr>
  <td>java.util.Calendar<sup>2</sup></td>
  <td>-</td>
  <td>
    <code>calendar</code><br />
    <code>calendar-datetime</code><br />
    <code>calendar-date</code><br />
    <code>calendar-time</code>
  </td>
</tr>
<tr><td>java.util.UUID</td><td>-</td><td><code>uuid</code></td></tr>
<tr><td>java.net.URL</td><td>-</td><td><code>url</code></td></tr>
<tr><td>java.lang.Enum<sup>3</sup></td><td>-</td><td><code>-</code></td></tr>
</tbody>
</table>

&nbsp;<sup>1</sup> By default, the `date` alias is used for `java.util.Date` types that contain date information only, and the `time`
alias is used for `java.util.Date` types that contain only time information. Only the `datetime` alias can be used to
replace the default type handler for the `java.util.Date` class.

&nbsp;<sup>2</sup> By default, the `calendar-date` alias is used for `java.util.Calendar` types that contain date information only, and
the `calendar-time` alias is used for `java.util.Date` types that contain only time information. Only
the `calendar-datetime` and `calendar` aliases can be used to replace the default type handler for
the `java.util.Calendar` class.

&nbsp;<sup>3</sup> By default, enums are converted using `Enum.valueOf(Class, String)`. If `format="toString"`, the enum will be
converted using values computed by calling `toString()` for each enum value. In either case, conversion is case
sensitive. As with other types, a custom type handler can also be used for enums.

Optionally, a `format` attribute can be used to pass a decimal format for `java.lang.Number` types, and for passing a
date format for `java.util.Date` types. In the example below, the `hireDate` field uses the `SimpleDateFormat` pattern "
yyyy-MM-dd", and the `salary` field uses the `DecimalFormat` pattern "#,##0". For more information about supported
patterns, please reference the API documentation for Java's `java.text.DecimalFormat` and `java.text.SimpleDateFormat`
classes.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="header" minOccurs="1" maxOccurs="1" class="map">
      <field name="recordType" rid="true" literal="Header" />
      <field name="fileDate" type="java.util.Date" />
    </record>
    <record name="employee" minOccurs="0" maxOccurs="unbounded" class="map">
      <field name="recordType" rid="true" literal="Detail" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" type="int" format="#,##0" />
      <field name="hireDate" type="date" format="yyyy-MM-dd" />
    </record>
    <record name="trailer" minOccurs="1" maxOccurs="1" class="map">
      <field name="recordType" rid="true" literal="Trailer" />
      <field name="recordCount" type="int" />
    </record>
  </stream>

</beanio>
```

#### 4.3.2. Custom Type Handlers

Field type conversion is performed by a _type handler_. BeanIO includes type handlers for common Java types, or you can
create your own type handler by implementing the `org.beanio.types.TypeHandler` interface shown below. When writing a
custom type handler, make sure to handle null values and empty strings. Only one instance of your type handler is
created, so if you plan to concurrently read or write multiple streams, make sure your type handler is also thread safe.

```java
package org.beanio.types;

public interface TypeHandler {
    public Object parse(String text) throws TypeConversionException;
    public String format(Object value);
    public Class<?> getType();
}
```

The following example shows a custom type handler for the `java.lang.Boolean` class and `boolean` primitive based on "Y"
or "N" indicators.

```java
import org.beanio.types.TypeHandler;

public class YNTypeHandler implements TypeHandler {
    public Object parse(String text) throws TypeConversionException {
        return "Y".equals(text);
    }
    public String format(Object value) {
        return value != null && ((Boolean)value).booleanValue() ? "Y" : "N";
    }
    public Class<?> getType() {
        return Boolean.class;
    }
}
```

A type handler may be explicitly named using the `name` attribute, and/or registered for all fields of a particular type
by setting the `type` attribute. The `type` attribute can be set to the fully qualified class name or type alias of the
class supported by the type handler. To reference a named type handler, use the `typeHandler` field attribute when
configuring the field.

Many default type handlers included with BeanIO support customization through the use of one or more `property`
elements, where the `name` attribute is a bean property of the type handler, and the `value` attribute is the property
value.

Type handlers can be declared globally (for all streams in the mapping file) or for a specific stream. Globally declared
type handlers may optionally use a `format` attribute to narrow the type handler scope to a specific stream format.

In the example below, the first `DateTypeHandler` is declared globally for all stream formats. The
second `DateTypeHandler` overrides the first for `java.util.Date` types in an XML formatted stream, and
the `YNTypeHandler` is declared only for the 'employeeFile' stream. Stream specific type handlers override global type
handlers when declared with the same name or for the same type.

```xml
<beanio>

  <typeHandler type="java.util.Date" class="org.beanio.types.DateTypeHandler">
    <property name="pattern" value="MMddyyyy" />
    <property name="lenient" value="true" />
  </typeHandler>
  <typeHandler type="java.util.Date" format="xml" class="org.beanio.types.DateTypeHandler">
    <property name="pattern" value="yyyy-MM-dd" />
  </typeHandler>

  <stream name="employeeFile" format="csv">
    <typeHandler name="ynHandler" class="example.YNTypeHandler" />

    <record name="employee" minOccurs="0" maxOccurs="unbounded" class="map">
      <field name="recordType" rid="true" literal="Detail" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" />
      <field name="exempt" typeHandler="ynHandler" />
    </record>
  </stream>

</beanio>
```

#### 4.3.3. Repeating Fields

Repeating fields are also supported by BeanIO. For example, lets assume our `Employee` bean object contains a list of
account numbers.

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    List<Integer> accounts;

    // getters and setters not shown...
}
```

And lets assume our input file now looks like this:

```
Joe,Smith,Developer,75000,10012009
Chris,Johnson,Sales,80000,05292006,100012,200034,200045
Jane,Doe,Architect,80000,01152008
Jon,Anderson,Manager,85000,03182007,333001
```

In this example, the `accounts` bean property can be defined in the mapping file using a `collection` field attribute.
The `collection` attribute can be set to the fully qualified class name of a `java.util.Collection` subclass, or to one
of the collection type aliases below.

<table className="indent">
<tbody>
<tr><th>Class</th><th>Alias</th><th>Default Implementation</th></tr>
<tr><td>java.util.Collection</td><td><code>collection</code></td><td>java.util.ArrayList</td></tr>
<tr><td>java.util.List</td><td><code>list</code></td><td>java.util.ArrayList</td></tr>
<tr><td>java.util.Set</td><td><code>set</code></td><td>java.util.HashSet</td></tr>
<tr><td>(Java Array)</td><td><code>array</code></td><td>N/A</td></tr>
</tbody>
</table>

Repeating fields can declare the number of occurrences of the field using the `minOccurs` and `maxOccurs` field
attributes. If not declared, `minOccurs` will default to 1, and `maxOccurs` will default to the `minOccurs` value or 1,
whichever is greater.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
      <field name="accounts" type="int" collection="list" minOccurs="0" maxOccurs="unbounded" />
    </record>
  </stream>

</beanio>
```

Flat file formats (CSV, delimited and fixed length) may only contain one field or segment of indeterminate length (i.e.
where `maxOccurs` is greater than `minOccurs`). The position of components that follow are assumed to be relative to the
end of the record.

If a field repeats a fixed number of times based on a preceding field in the same record, the `occursRef` attribute can
be used to identify the name of the controlling field. If the controlling field is not bound to a separate property of
its parent bean object, be sure to specify `ignore="true"`. The following mapping file shows how to configure the _
accounts_ field occurrences to be dependent on the _numberOfAccounts_ field. If desired, `minOccurs` and `maxOccurs` may
still be specified to validate the referenced field occurrences value.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
      <field name="numberOfAccounts" ignore="true" />
      <field name="accounts" type="int" collection="list" occursRef="numberOfAccounts" />
    </record>
  </stream>

</beanio>
```

Note that a repeating field can not be used for record identification.

#### 4.3.4. Fixed Length Fields

Fixed length fields require a little extra configuration than their delimited counterparts. Let's redefine our employee
file example using the fixed length format below.

<div className="indent">
  <table>
    <tbody>
    <tr><th>Position</th><th>Field</th><th>Format</th><th>Length</th></tr>
    <tr><td>0</td><td>First Name</td><td>Text</td><td>10</td></tr>
    <tr><td>10</td><td>Last Name</td><td>Text</td><td>10</td></tr>
    <tr><td>20</td><td>Job Title</td><td>Text</td><td>10</td></tr>
    <tr><td>30</td><td>Salary</td><td>Number</td><td>6</td></tr>
    <tr><td>36</td><td>Hire Date</td><td>Date (MMDDYYYY)</td><td>8</td></tr>
    </tbody>
  </table>
</div>

A fixed length version of the employee file might look like the following:

```
Joe       Smith    Developer 07500010012009
Jane      Doe      Architect 08000001152008
Jon       Anderson Manager   08500003182007
```

The length of a fixed length field must be configured using the `length` field attribute. By default, fixed length
fields are left justified and padded with spaces, but these settings can be overridden using the `padding` and `justify`
field attributes. Field padding can be set to any single character, and field justification can be set to `left`
or `right`. Using these attributes, our mapping file can now be updated as follows:

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" length="10" />
      <field name="lastName" length="10" />
      <field name="title" length="10" />
      <field name="salary" length="6" padding="0" justify="right" />
      <field name="hireDate" length="8" format="MMddyyyy" />
    </record>
  </stream>

</beanio>
```

The configured padding character is removed from the beginning of the field if right justified, or from the end of the
field if left justified, until a character is found that does not match the padding character. If the entire field is
padded, `Number` property types default to the padding character if it is a digit, and the padding character is ignored
for `Character` types. To illustrate this, some examples are shown in the table below.

<table className="indent">
<tbody>
<tr>
  <th>Justify</th>
  <th>Type</th>
  <th>Padding</th>
  <th>Padded Text</th>
  <th>Unpadded Text</th>
</tr>
<tr>
  <td rowSpan="4"><code>left</code></td>
  <td rowSpan="2"><code>String</code></td>
  <td rowSpan="2"><code>"&nbsp;"</code></td>
  <td>
    <code>"George&nbsp;&nbsp;"</code>
  </td>
  <td><code>"George"</code></td>
</tr>
<tr>
  <td><code>"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"</code></td>
  <td><code>""</code></td>
</tr>
<tr>
  <td rowSpan="2"><code>Character</code></td>
  <td rowSpan="2"><code>"&nbsp;"</code></td>
  <td><code>"A"</code></td>
  <td><code>"A"</code></td>
</tr>
<tr>
  <td><code>" "</code></td>
  <td><code>" "</code></td>
</tr>
<tr>
  <td rowSpan="5"><code>right</code></td>
  <td rowSpan="5"><code>Number</code></td>
  <td rowSpan="2"><code>"0"</code></td>
  <td><code>"00123"</code></td>
  <td><code>"123"</code></td>
</tr>
<tr>
  <td><code>"00000"</code></td>
  <td><code>"0"</code></td>
</tr>
<tr>
  <td rowSpan="2"><code>"9"</code></td>
  <td><code>"00000"</code></td>
  <td><code>"00000"</code></td>
</tr>
<tr>
  <td><code>"99999"</code></td>
  <td><code>"9"</code></td>
</tr>
<tr>
  <td rowSpan="1"><code>"X"</code></td>
  <td><code>"XXXXX"</code></td>
  <td><code>""</code></td>
</tr>
</tbody>
</table>


The marshalling and unmarshalling behavior of null field values for a padded field is further controlled using
the `required` attribute. If `required` is set to true, null field values are marshalled by filling the field with the
padding character. If `required` is set to false, a null field value is marshalled as spaces for fixed length streams
and an empty string for non-fixed length streams. Similarly, if `required` is set to false, spaces are unmarshalled to a
null field value regardless of the padding character. To illustrate this, the following table shows the field text for a
right justified zero padded 3 digit number.

<table className="indent">
<tbody>
<tr>
  <th>Required</th>
  <th>Field Value</th>
  <th>Field Text<br /> (Fixed Length)</th>
  <th>Field Text<br />(CSV, Delimited, XML)</th>
</tr>
<tr>
  <td rowSpan="2"><code>true</code></td>
  <td>0</td>
  <td>"<code>000</code>"</td>
  <td>"<code>000</code>"</td>
</tr>
<tr>
  <td>null</td>
  <td>"<code>000</code>"<sup>1</sup></td>
  <td>"<code>000</code>"<sup>1</sup></td>
</tr>
<tr>
  <td rowSpan="2"><code>false</code></td>
  <td>0</td>
  <td>"<code>000</code>"</td>
  <td>"<code>000</code>"</td>
</tr>
<tr>
  <td>null</td>
  <td>"<code>&nbsp;&nbsp;&nbsp;</code>"</td>
  <td>""</td>
</tr>
</tbody>
</table>

<sup>1</sup> Applies to marshalling only. Unmarshalling "000" would produce a field value of 0.

As hinted to above, padding settings can be applied to any field for any stream type.

### 4.4. Constants

If a bean property does not map to a field in the stream, a constant property value can still be set using a `property`
element. Like a field, all properties must specify a `name` attribute, which by default, is used to get and set the
property value from the bean object. Properties also require a `value` attribute for setting the textual representation
of the property value. The value text is type converted using the same rules and attributes (`type`, `typeHandler`
and `format`) used for field type conversion described above. Collection type properties are not supported.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="map">
      <property name="recordType" value="employee" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
    </record>
  </stream>

</beanio>
```

Constant properties may be useful in two scenarios:

* When reading an input stream (unmarshalling), if multiple records are mapped to the same bean class, such as a Map, a
  property can be used to set a property, or a Map key, for identifying the record type without querying
  the `BeanReader`.
* When writing an output stream (marshalling), a record mapping can be selected based on a record identifying property
  value by setting `rid` to true. This allows the same bean class to be unmarshalled to different record types based on
  a property that may not exist in the output stream.

### 4.5. Segments

A segment is a group of fields within a record. Segments are most often used to bind a group of fields to a nested bean
object or collection of bean objects, and are configured in a mapping file using a `segment` element.

Prior to release 2.x, the `bean` element performed this task. A `segment` supports all the functionality of a `bean`
element, but unlike the original `bean` element, a `segment` is not required to be bound to a bean object. This allows
repeating segments to be fully validated during unmarshalling, without necessarily binding the fields to a bean object.
An "unbound" segment also allows an arbitrary number of XML fields to be wrapped by other XML nodes without creating
bean objects that mirror the same hierarchy.

#### 4.5.1. Nested Beans

As mentioned, a record can be divided into nested bean objects using a `segment` element. First, let's suppose we store
an address in our CSV employee file, so that the record layout might look like this:

<table className="indent">
  <tbody>
  <tr><th>Position</th><th>Field</th><th>Format</th></tr>
  <tr><td>0</td><td>First Name</td><td>Text</td></tr>
  <tr><td>1</td><td>Last Name</td><td>Text</td></tr>
  <tr><td>2</td><td>Job Title</td><td>Text</td></tr>
  <tr><td>3</td><td>Salary</td><td>Number</td></tr>
  <tr><td>4</td><td>Hire Date</td><td>Date (MMDDYYYY)</td></tr>
  <tr><td>5</td><td>Street</td><td>Text</td></tr>
  <tr><td>6</td><td>City</td><td>Text</td></tr>
  <tr><td>7</td><td>State</td><td>Text</td></tr>
  <tr><td>8</td><td>Zip</td><td>Text</td></tr>
  </tbody>
</table>


Second, lets suppose we want to store address information in a new `Address` bean object like the one below, and add
an `Address` reference to our `Employee` class.

```java
package example;

public class Address {
    String street;
    String city;
    String state;
    String zip;

    // getters and setters not shown...
}
```

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    Address mailingAddress;

    // getters and setters not shown...
}
```

With this information, we can now update our employee CSV mapping file to accomodate the nested `Address` object.
A `segment` must include a `name` attribute, and may optionally provide a `class` attribute to bind its children to a
bean object. If `class` is set, the attribute must be set to the fully qualified class name of the bean object, or
to `map`, or to the class name of any concrete `java.util.Map` implementation. If the bean class is of
type `java.util.Map`, field values are stored in the Map using the configured field names for keys. By default,
the `name` attribute is used to determine the getter and setter on its parent bean or record. Alternatively, `getter`
or `setter` attributes can be used to override the default property name similar to a field property.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
      <segment name="mailingAddress" class="example.Address">
        <field name="street" />
        <field name="city" />
        <field name="state" />
        <field name="zip" />
      </segment>
    </record>
  </stream>

</beanio>
```

If `class` is not set, fields will be automatically bound to the segment's parent bean object, which would be
the `Employee` object in the example above.

If needed, segments can be further divided into other segments. There is no limit to the number of nested levels that
can be configured in a mapping file.

#### 4.5.2. Repeating Segments

Similar to repeating fields, BeanIO supports repeating segments, which may be bound to a collection of bean objects.
Continuing our previous example, let's suppose the employee CSV file may contain 1 or more addresses for each employee.
Thus our `Employee` bean object might look like this:

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    List<Address> addressList;

    // getters and setters not shown...
}
```

And our input file might look like this:

```
Joe,Smith,Developer,75000,10012009,123 State St,Chicago,IL,60614
Jane,Doe,Architect,80000,01152008,456 Main St,Chicago,IL,60611,111 Michigan Ave,Chicago,IL,60611
Jon,Anderson,Manager,85000,03182007,1212 North Ave,Chicago,IL,60614
```

In our mapping file, in order to bind a segment to a collection, simply set it's `collection` attribute to the fully
qualified class name of a `java.util.Collection` or `java.util.Map` subclass, or to one of the collection type aliases
below.

<table className="indent">
<tbody>
<tr><th>Class</th><th>Alias</th><th>Default Implementation</th></tr>
<tr><td>java.util.Collection</td><td><code>collection</code></td><td>java.util.ArrayList</td></tr>
<tr><td>java.util.List</td><td><code>list</code></td><td>java.util.ArrayList</td></tr>
<tr><td>java.util.Set</td><td><code>set</code></td><td>java.util.HashSet</td></tr>
<tr><td>java.util.Map</td><td><code>map</code></td><td>java.util.LinkedHashMap</td></tr>
<tr><td>(Java Array)</td><td><code>array</code></td><td>N/A</td></tr>
</tbody>
</table>


Repeating segments can declare the number of occurrences using the `minOccurs` and `maxOccurs` attributes. If not
declared, `minOccurs` will default to 1, and `maxOccurs` will default to the `minOccurs` value or 1, whichever is
greater.

Just like repeating fields, if the number of occurrences of a segment is dependent on a preceding field in the same
record, the `occursRef` attribute can be set to the name of the field that controls the number of occurrences.

Flat file formats (CSV, delimited and fixed length) may only contain one field or segment of indeterminate length (i.e.
where `maxOccurs` is greater than `minOccurs`). The position of components that follow are assumed to be relative to the
end of the record.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" format="MMddyyyy" />
      <segment name="addressList" collection="list" minOccurs="1" maxOccurs="unbounded" class="example.Address">
        <field name="street" />
        <field name="city" />
        <field name="state" />
        <field name="zip" />
      </segment>
    </record>
  </stream>

</beanio>
```

When working with repeating segments, there are a few restrictions to keep in mind:

* Repeating segments must appear consecutively in the record.
* Every field in a repeating segment must be declared. (There can be no field gaps in the segment configuration.)
* A repeating segment may not contain repeating descendants with variable occurrences.
* Repeating fields or fields that belong to a repeating segment may not be used for record identification.

#### 4.5.2.1. Inline Maps

As noted above, a segment can also be bound to a `java.util.Map` which provides support for "inline" maps. For example,
given the following CSV file of users,

```
id1,firstName1,lastName1,id2,firstName2,lastName2
jsmith,Joe,Smith,jdoe,Jane,Doe
```

The following mapping file could be used to create a Map of `User` objects by ID. The `key` attribute is used to set the
name of a descendant field to use for the Map key.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" target="userMap">
      <segment name="userMap" class="example.User" collection="map" key="id"
          minOccurs="1" maxOccurs="unbounded">
        <field name="id" />
        <field name="firstName" />
        <field name="lastName" />
      </segment>
    </record>
  </stream>

</beanio>
```

If a Map of last names by ID is needed instead, simply replace the `class` attribute with `value` and specify the name
of the descendant field to use for the Map value. In this case, first name is effectively ignored.

```xml
<beanio>

  <stream name="employeeFile" format="csv">
    <record name="employee" target="userMap">
      <segment name="userMap" collection="map" key="id" value="lastName"
          minOccurs="1" maxOccurs="unbounded">
        <field name="id" />
        <field name="firstName" />
        <field name="lastName" />
      </segment>
    </record>
  </stream>

</beanio>
```

### 4.6. Stream Validation

A `BeanReader` will throw an `InvalidRecordException` if a record or one of its fields fails a configured validation
rule. There are two types of errors reported for an invalid record: record level errors and field level errors. If a
record level error occurs, further processing of the record is aborted and an excception is immediately thrown. If a
field level error is reported, the `BeanReader` will continue to process the record's other fields before throwing an
exception.

When an `InvalidRecordException` is thrown, the exception will contain the reported record and field level errors. The
following code shows how this information can be accessed using the `RecordContext`.

```java
    try (BeanReader in = ...) {
        Object record = in.read();
        if (record != null) {
            // process record...
        }
    }
    catch (InvalidRecordException ex) {
        RecordContext context = ex.getRecordContext();
        if (context.hasRecordErrors()) {
            for (String error : context.getRecordErrors()) {
                // handle record errors...
            }
        }
        if (context.hasFieldErrors()) {
            for (String field : context.getFieldErrors().keySet()) {
                for (String error : context.getFieldErrors(field)) {
                    // handle field error...
                }
            }
        }
    }
}
```

Alternatively, it may be simpler to register a `BeanReaderErrorHandler` for handling non-fatal exceptions. The example
below shows how invalid records could be written to a reject file by extending `BeanReaderErrorHandlerSupport`. (Note
that the example assumes the mapping file does not bind a record group to a bean object.)

```java
    try (BeanReader input = ...;
         BufferedWriter rejects = ...) {
        input.setErrorHandler(new BeanReaderErrorHandlerSupport() {
            public void invalidRecord(InvalidRecordException ex) throws Exception {
                rejects.write(ex.getRecordContext().getRecordText());
                rejects.newLine();
            }
        });

        Object record = null;
        while ((record = input.read()) != null) {
            // process a valid record
        }

        rejects.flush();
    }
```

Record and field level error messages can be customized and localized through the use of resource bundles. A resource
bundle is configured at the stream level using the `resourceBundle` attribute as shown below.

```xml
<beanio>

  <typeHandler type="java.util.Date" class="org.beanio.types.DateTypeHandler">
    <property name="pattern" value="MMddyyyy" />
  </typeHandler>

  <stream name="employeeFile" format="csv" resourceBundle="example.messages" >
    <record name="employee" class="map">
      <field name="recordType" rid="true" literal="Detail" />
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" />
    </record>
  </stream>

</beanio>
```

Record level error messages are retrieved using the following prioritized list of keys. If a message is not configured
under the name of the first key, the next key will be tried until a message is found, or a default message is used.

1. `recorderror.[record name].[rule]`
2. `recorderror.[rule]`

Similarly, field level error messages are retrieved using the following priortized list of keys:

1. `fielderror.[record name].[field name].[rule]`
2. `fielderror.[record name].[rule]`
3. `fielderror.[rule]`

More descriptive or localized labels can be configured for record and field names using the keys `label.[record name]`
and `label.[record name].[field name]` respectively.

For example, the following resource bundle could be used to customize a few error messages for the employee file.

```properties
## 'employee' record label:
label.employee = Employee Record
## 'firstName' field label:
label.employee.firstName = First Name Field
## Unidentified record error message:
recorderror.unidentified = Unidentified record at line {0}
## Type conversion error message for the 'hireDate' field:
fielderror.employee.hireDate.type = Invalid date format
## Maximum field length error message for all fields:
fielderror.maxLength = Maximum field length exceeded for {3}
```

Error messages are formatted using a `java.text.MessageFormat`. Depending on the validation rule that was violated,
different parameters are passed to the `MessageFormat`. [Appendix B](#B) documents the parameters passed to
the `MessageFormat` for each validation rule.

#### 4.6.1. Record Validation

The following record level validation rules may be configured on a `record` element.

<table>
<tbody>
<tr><th>Attribute</th><th>Argument Type</th><th>Description</th></tr>
<tr>
  <td><code>minLength</code></td>
  <td>Integer</td>
  <td>Validates the record contains at least <code>minLength</code> fields for delimited and CSV formatted streams,
    or has at least <code>minLength</code> characters for fixed length formatted streams.</td>
</tr>
<tr>
  <td><code>maxLength</code></td>
  <td>Integer</td>
  <td>Validates the record contains at most <code>maxLength</code> fields for delimited and CSV formatted streams,
    or has at most <code>maxLength</code> characters for fixed length formatted streams.</td>
</tr>
</tbody>
</table>

#### 4.6.2. Field Validation

BeanIO supports several common field validation rules when reading an input stream. All field validation rules are
validated against the field text before type conversion. When field trimming is enabled, `trim="true"`, all validations
are performed after the field's text has first been trimmed. Field validations are ignored when writing to an output
stream.

The following table lists supported field attributes for validation.

<table>
<tbody>
<tr><th>Attribute</th><th>Argument Type</th><th>Description</th></tr>
<tr>
  <td><code>required</code></td>
  <td>Boolean</td>
  <td>When set to <code>true</code>, validates the field is present and the field text is
  not the empty string.</td>
</tr>
<tr>
  <td><code>minLength</code></td>
  <td>Integer</td>
  <td>Validates the field text is at least N characters.</td>
</tr>
<tr>
  <td><code>maxLength</code></td>
  <td>Integer</td>
  <td>Validates the field text does not exceed N characters.</td>
</tr>
<tr>
  <td><code>literal</code></td>
  <td>String</td>
  <td>Validates the field text exactly matches the literal value.</td>
</tr>
<tr>
  <td><code>regex</code></td>
  <td>String</td>
  <td>Validates the field text matches the given regular expression pattern.</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>String</td>
  <td>Validates the minimum occurrences of the field in a stream.  If the field is present in the stream,
    <code>minOccurs</code> is satisfied, and the <code>required</code> setting determines whether a value is required.</td>
</tr>
</tbody>
</table>

### 4.7. Templates

When a common set of fields is used by multiple record types, configuration may be simplified using templates. A
template is a reusable list of components (segments, fields, and properties/constants) that can be included by a record,
segment or other template. The following example illustrates some of the ways a template can be used:

```xml
<beanio>

  <template name="address">
    <field name="street1" />
    <field name="street2" />
    <field name="city" />
    <field name="state" />
    <field name="zip" />
  </template>

  <template name="employee">
    <field name="firstName" />
    <field name="lastName" />
    <field name="title" />
    <field name="salary" />
    <field name="hireDate" format="MMddyyyy" />
    <segment name="mailingAddress" template="address" class="example.Address" />
  </template>

  <stream name="employeeFile" format="csv">
    <record name="employee" template="employee" class="example.Employee" />
  </stream>

  <stream name="addressFile" format="csv">
    <record name="address" class="example.Address">
      <field name="location" />
      <include template="address"/>
      <field name="attention" />
    </record>
  </stream>

</beanio>
```

Templates are essentially copied into their destination using the `include` element. For convenience, `record`
and `segment` elements support a `template` attribute which includes the template before any other children.

The `include` element can optionally specify a positional offset for included fields using the `offset` attribute. The
following example illustrates this behavior. Even when using templates, remember that `position` must be declared for
all fields or none.

```xml
<beanio>

  <template name="address">
    <field name="street1" position="0" />
    <field name="street2" position="1" />
    <field name="city" position="2" />
    <field name="state" position="3" />
    <field name="zip" position="4" />
  </template>

  <stream name="addressFile" format="csv">
    <record name="address" class="example.Address">
      <field name="location" position="0" />
      <include template="address" offset="1"/>
      <field name="attention" position="6" />
    </record>
  </stream>

</beanio>
```

### 4.8. Advanced Topics

#### 4.8.1. Mapping Bean Objects that Span Multiple Records

Since release 2.0, BeanIO supports the binding of multiple consecutive records to a single bean object. This can be
achieved by assigning a bean class to a `stream` or `group` containing the `record` configurations bound to the bean.

Let's suppose we are reading a CSV input file of orders that contains an order, followed by the customer that placed the
order, followed by a detailed list of items that make up the order. A sample input file might look like this:

```
Order,101,2012-02-01,5.00
Customer,John,Smith
Item,Apple,2,2.00
Item,Orange,1,1.00
Order,102,2012-02-01,3.00
Customer,Jane,Johnson
Item,Ham,1,3.00
```

Let's then suppose we want to read the following `Order` class from the stream, which contains a reference to `Customer`
and `Item` classes. (For brevity, getters and setters are not shown.)

```java
package example;
import java.util.Date;

public class Order {
    String id;
    Date date;
    BigDecimal amount;
    Customer customer;
    List&lt;Item&gt; items;
}

public class Customer {
    String firstName;
    String lastName;
}

public class Item {
    String name;
    int quantity;
    BigDecimal amount;
}
```

Now to read and write `Order` objects from our example stream, the following mapping file can be used:

```xml
<beanio>

  <stream name="orders" format="csv">
    <group name="order" class="example.Order" minOccurs="0" maxOccurs="unbounded">
      <record name="orderRecord" order="1" minOccurs="1">
        <field name="recordType" rid="true" literal="Order" ignore="true" />
        <field name="id" />
        <field name="date" format="yyyy-MM-dd" />
        <field name="amount" />
      </record>
      <record name="customer" class="example.Customer" order="2" minOccurs="1" maxOccurs="1">
        <field name="recordType" rid="true" literal="Customer" ignore="true" />
        <field name="firstName" />
        <field name="lastName" />
      </record>
      <record name="items" class="example.Item" collection="list" order="3" minOccurs="1" maxOccurs="unbounded">
        <field name="recordType" rid="true" literal="Item" ignore="true" />
        <field name="name" />
        <field name="quantity" />
        <field name="amount" />
      </record>
    </group>
  </stream>

</beanio>
```

By configuring a `class` on a `group` component, BeanIO will automatically marshal or unmarshal all of the group's
descendants in a single call to read or write from the stream. Also note that by not configuring a `class` on a `record`
, in this case our "orderRecord", the fields are instead set on the bean class assigned to it's parent group. Finally,
repeating records can be aggregated into a collection using a `collection` attribute at the `record` level, as used for
the "items" record. If necessary, `getter` and `setter` attributes can be configured on a `record` component as well.

If any record included in a group bound to a bean object is invalid, an `InvalidRecordException` is thrown, but only
after reading all the other records in the group. In such cases, the `InvalidRecordException` will
contain `RecordContext` objects for every record in the group read from the stream. If multiple records in the group are
invalid, only one `InvalidRecordException` is thrown.

If a malformed or unidentified record is read from the stream while unmarsahalling a record group, an exception is
immediately thrown, and the `BeanReader` will most likely **not** be able to recover. For this reason, when
unmarshalling untrusted sources, it is recommended that you read the stream twice, using the first pass to validate the
integrity of the file including syntax, record identification, record ordering, possible header/trailer counts, etc. For
example, the following mapping file might be used to validate our orders file.

```xml
<beanio>

  <stream name="orders-validation" format="csv">
    <group name="order" minOccurs="0" maxOccurs="unbounded">
      <record name="orderRecord" order="1" minOccurs="1">
        <field name="recordType" rid="true" literal="Order" ignore="true" />
      </record>
      <record name="customer" order="2" minOccurs="1">
        <field name="recordType" rid="true" literal="Customer" ignore="true" />
      </record>
      <record name="items" order="3" minOccurs="1" maxOccurs="unbounded">
        <field name="recordType" rid="true" literal="Item" ignore="true" />
      </record>
    </group>
  </stream>

</beanio>
```

In this case, we are validating syntax, record ordering and record identification for the entire file in a single call
to `beanReader.read()`, while leaving other record and field level validations for unmarshalling, which can be caught
and handled without worrying whether the `BeanReader` will be able to recover.

## 5.0. Mapping XML Streams

This section provides further details for using BeanIO to marshall and unmarshall Java objects to and from XML formatted
streams. This section assumes you are already familiar with the mapping file concepts documented in previous sections.

### 5.1. Introduction

BeanIO is similar to other OXM (Object to XML Mapping) libraries, except that it is also capable of marshalling and
unmarshalling extremely large XML files by reading and writing Java beans one record at a time. BeanIO uses a streaming
XML (StAX) parser to read and write XML, and will never hold more than the minimum amount of XML in memory needed to
marshall or unmarshall a single bean object. That said, it is still possible to run out of memory (heap space) with
poorly designed XML documents and/or misconfigured mapping files.

#### 5.1.1. My First XML Stream

Before diving into the details, let's start with a basic example using the employee input file
from [Section 2.1](#MyFirstStream) after it's been converted to XML (shown below).

```xml
<?xml version="1.0"?>
<employeeFile>
  <employee>
    <firstName>Joe</firstName>
    <lastName>Smith</lastName>
    <title>Developer</title>
    <salary>75000</salary>
    <hireDate>2009-10-12</hireDate>
  </employee>
  <employee>
    <firstName>Jane</firstName>
    <lastName>Doe</lastName>
    <title>Architect</title>
    <salary>80000</salary>
    <hireDate>2008-01-15</hireDate>
  </employee>
  <employee>
    <firstName>Jon</firstName>
    <lastName>Andersen</lastName>
    <title>Manager</title>
    <salary>85000</salary>
    <hireDate>2007-03-18</hireDate>
  </employee>
</employeeFile>
```

In this example, let's suppose we are unmarshalling the XML employee file into the same `Employee` bean object from
Section 2.1 and repeated below.

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;

    // getters and setters not shown...
}
```

Our original mapping file from Section 2.1 can now be updated to parse XML instead of CSV with only two minor changes.
First, the stream format is changed to `xml`. And second, the hire date field format is removed and replaced
with `type="date"`. With XML, the date format does not need to be explicity declared because it conforms to the W3C XML
Schema date syntax. (This will be further explained in [Section 5.7.1](#XmlTypeConversion)).

```xml
<beanio xmlns="http://www.beanio.org/2012/03"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <stream name="employeeFile" format="xml">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
  </stream>
</beanio>
```

That's it! No Java code changes are required, and as before, `Employee` bean objects will be unmarshalled from the XML
input stream each time `beanReader.read()` is called.

And also as before, `Employee` objects can be marshalled to an XML output stream using `beanWriter.write(Object)`.
However, please note that when marshalling/writing XML, it is even more important to call `beanWriter.close()` so that
the XML document can be properly completed.

#### 5.1.2. A Note on XML Validation

Because BeanIO is built like a pull parser, it does not support XML validation against a DTD or XML schema. Where this
functionality is needed, it is recommended to make two passes on the input document. The first pass can use a SAX parser
or other means to validate the XML, and the second pass can use BeanIO to parse and process bean objects read from the
document.

### 5.2. XML Names

Each BeanIO mapping component (stream, group, record, segment and field), is mapped to an XML element with the same
local name. If the name of the stream, group, etc. does not match the XML element name, the `xmlName` attribute can be
used. For example, if the name of the root element in the previous example's employee file is changed from "
employeeFile" to "employees", and "title" was renamed "position", the mapping file could be updated as shown below.

```xml
<beanio>

  <stream name="employeeFile" format="xml" xmlName="employees">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" xmlName="position" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
  </stream>

</beanio>
```

### 5.3. XML Namespaces

XML namespaces can be enabled through the use of the `xmlNamespace` attribute on any mapping component (stream, group,
record, segment or field). By default, all mapping elements inherit their namespace (or lack thereof) from their parent.
When a namespace is declared, the local name _and_ namespace must match when unmarshalling XML, and appropriate
namespace declarations are included when marshalling bean objects. For example, let's suppose our employee file contains
namespaces as shown below.

```xml
<?xml version="1.0"?>
<employeeFile xmlns="http://example.com/employeeFile" xmlns:n="http://example.com/name">
  <e:employee xmlns:e="http://example.com/employee">
    <n:firstName>Joe</n:firstName>
    <n:lastName>Smith</n:lastName>
    <e:title>Developer</e:title>
    <e:salary>75000</e:salary>
    <e:hireDate>2009-10-12</e:hireDate>
  </e:employee>
  .
  .
  .
</employeeFile>
```

To unmarshall the file using namespaces, and to marshall Employee bean objects in the same fashion as they appear above,
the following mapping file can be used.

```xml
<beanio>

  <stream name="employeeFile" format="xml" xmlNamespace="http://example.com/employeeFile">
    <parser>
      <property name="namespaces" value="n http://example.com/name"/>
    </parser>
    <record name="employee" class="example.Employee" xmlNamespace="http://example.com/employee" xmlPrefix="e">
      <field name="firstName" xmlNamespace="http://example.com/name" />
      <field name="lastName" xmlNamespace="http://example.com/name" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
  </stream>

</beanio>
```

From this example, the following behavior can be observed:

* An `xmlPrefix` attribute can be used to assign a namespace prefix anywhere a `xmlNamespace` is declared.
* If a prefix is configured, the namespace is assigned to the prefix and the prefix is used from that point forward.
  This can be seen on the 'employee' element (`record` configuration).
* If a prefix is not configured, a namespace declaration will replace the default namespace. This can be seen on the '
  employeeFile' element (`stream` configuration).
* As previously mentioned, namespace are by default inherited from parent mapping elements. This can be seen on the '
  title', 'salary' and 'hireDate' elements (`field` configurations).
* Namespaces can be eagerly declared on the root element using the writer's `namespaces` property. Multiple namespaces
  can be declared with space delimiters such as '_prefix1 namespace1 prefix2 namespace2..._'.

BeanIO also supports a special wildcard namespace. If `xmlNamespace` is set to '\*', any namespace is allowed when
unmarshalling XML, and no namespace declaration will be made when marshalling XML.

The following table summarizes namespace configuration options and their effect on the configured element and a child
that inherits it's parent namespace.

<table className="indent">
<tbody>
<tr>
  <th>Mapping Configuration</th>
  <th>Marshalled Element And Child</th>
</tr>
<tr>
  <td><pre>[None]</pre></td>
  <td><pre>&lt;element&gt;
  &lt;child/&gt;
&lt;/element&gt;</pre></td>
</tr>
<tr>
  <td><pre>xmlNamespace="*"</pre></td>
  <td><pre>&lt;element&gt;
  &lt;child/&gt;
&lt;/element&gt;</pre></td>
</tr>
<tr>
  <td><pre>xmlNamespace=""</pre></td>
  <td><pre>&lt;element xmlns=""&gt;
  &lt;child/&gt;
&lt;/element&gt;</pre></td>
</tr>
<tr>
  <td><pre>xmlNamespace="http://example.com"</pre></td>
  <td><pre>&lt;element xmlns="http://example.com"&gt;
  &lt;child/&gt;
&lt;/element&gt;</pre></td>
</tr>
<tr>
  <td><pre>xmlNamespace="http://example.com" xmlPrefix="e"</pre></td>
  <td><pre>&lt;e:element xmlns="http://example.com"&gt;
  &lt;e:child/&gt;
&lt;/e:element&gt;</pre></td>
</tr>
</tbody>
</table>

### 5.4. Streams

When unmarshalling multiple records from an XML document, the `stream` configuration is mapped to the root element in
the XML formatted stream. This default behavior has been demonstrated in previous examples. If on the other hand, an XML
document contains only a single record, the document can be fully read or written by setting the `stream`
configuration's `xmlType` attribute to `none`. This behavior is similar to other OXM libraries that marshall or
unmarshall one bean object per XML document.

For example, if BeanIO was used to unmarshall a single employee record submitted via a web service, the XML document
might look like the following. Notice there is no 'employeeFile' root element for containing multiple employee records.

```xml
<employee>
  <firstName>Joe</firstName>
  <lastName>Smith</lastName>
  <title>Developer</title>
  <salary>75000</salary>
  <hireDate>2009-10-12</hireDate>
</employee>
```

In this example, the following highlighted changes can be made to our mapping file to allow BeanIO to
unmarshall/marshall a single employee record.

```xml
<beanio>

  <stream name="employeeFile" format="xml" xmlType="none">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
  </stream>

</beanio>
```

### 5.5. Groups

Like other mapping elements, groups are also mapped to XML elements by default. Or if a group is used only for control
purposes, the group's `xmlType` attribute can be set to `none`.

### 5.6. Records

A record is always mapped to an XML element. As we've seen before, records are matched based on their group context and
configured record identifying fields. XML records are further matched using their XML element name, as defined
by `xmlName`, or if not present, `name`. Other than configured record identifying fields, segment and field names
declared within the record are not used to identify records.

For example, let's suppose our employee file differentiated managers using 'manager' tags.

```xml
<?xml version="1.0"?>
<employeeFile>
  <employee>
    <firstName>Joe</firstName>
    <lastName>Smith</lastName>
    <title>Developer</title>
    <salary>75000</salary>
    <hireDate>2009-10-12</hireDate>
  </employee>
  <employee>
    <firstName>Jane</firstName>
    <lastName>Doe</lastName>
    <title>Architect</title>
    <salary>80000</salary>
    <hireDate>2008-01-15</hireDate>
  </employee>
  <manager>
    <firstName>Jon</firstName>
    <lastName>Andersen</lastName>
    <title>Manager</title>
    <salary>85000</salary>
    <hireDate>2007-03-18</hireDate>
  </manager>
</employeeFile>
```

To bind managers to a new `Manager` bean we could use the following mapping configuration.

```xml
<beanio>

  <stream name="employeeFile" format="xml">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
    <record name="manager" class="example.Manager">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
    </record>
  </stream>

</beanio>
```

### 5.7. Fields

A field is mapped to XML using the field's `xmlType` attribute, which defaults to `element`. The field XML type can be
set to `element`, `attribute`, `text`, or `none`. The following table illustrates possible configurations, except
for `none` which is not covered here.

<table className="indent">
<tbody>
<tr>
  <th>Record Definition</th>
  <th>Sample Record</th>
</tr>
<tr>
  <td>
    <pre>
        &lt;record name="person" className="map"&gt;
          &lt;field name="name" <span className="highlight">xmlType="element"</span>/&gt;
        &lt;/record&gt;
    </pre>
  </td>
  <td>
    <pre>
        &lt;person&gt;
            &lt;name&gt;John&lt;/name&gt;
        &lt;/person&gt;
    </pre>
</td>
</tr>
<tr>
  <td>
    <pre>
        &lt;record name="person" className="map"&gt;
            &lt;field name="name" <span className="highlight">xmlType="attribute"</span>/&gt;
        &lt;/recors&gt;
    </pre>
  </td>
  <td>
    <pre>
        &lt;person name="John"/&gt;
    </pre>
</td>
</tr>
<tr>
  <td>
    <pre>
        &lt;record name="person" className="map"&gt;
            &lt;field name="name" <span className="highlight">xmlType="text"</span>/&gt;
        &lt;/record&gt;
    </pre>
  </td>
  <td>
    <pre>
        &lt;person&gt;John&lt;/person&gt;
    </pre>
</td>
</tr>
</tbody>
</table>

#### 5.7.1. Field Type Conversion

Field type conversion works the same way for XML formatted streams as it does for other formats. However, several
default type handlers are overridden specifically for XML formatted streams to conform with W3C XML Schema built-in data
types according to this [specification](http://www.w3.org/TR/xmlschema-2/). The following table summarizes overriden
type handlers:

<table className="indent">
<tbody>
<tr>
  <th>Class or Type Alias</th>
  <th>XML Schema Data Type</th>
  <th>Example</th>
</tr>
<tr>
  <td><code>date<br />calendar-date</code></td>
  <td><a href="http://www.w3.org/TR/xmlschema-2/#date">date</a></td>
  <td><code>2011-01-01</code></td>
</tr>
<tr>
  <td><code>datetime<br />java.util.Date<br />calendar<br />calendar-datetime<br />java.util.Calendar</code></td>
  <td><a href="http://www.w3.org/TR/xmlschema-2/#dateTime">dateTime</a></td>
  <td><code>2011-01-01T15:14:13</code></td>
</tr>
<tr>
  <td><code>time<br />calendar-time</code></td>
  <td><a href="http://www.w3.org/TR/xmlschema-2/#time">time</a></td>
  <td><code>15:14:13</code></td>
</tr>
<tr>
  <td><code>boolean</code></td>
  <td><a href="http://www.w3.org/TR/xmlschema-2/#boolean">boolean</a></td>
  <td><code>true</code></td>
</tr>
</tbody>
</table>

Like other type handlers, XML specific type handlers can be customized or completely replaced. Please consult BeanIO
javadocs for customization details.

#### 5.7.2. Marshalling Null Field Values

The `nillable` and `minOccurs` field attributes control how a null field value is marshalled. If `minOccurs` is 0, an
element or attribute is not marshalled for the field. If an element type field has `nillable` set to `true`
and `minOccurs` set to 1, the W3C XML Schema Instance attribute `nil` is set to `true`.

This behavior is illustrated in the following table.

<table className="indent">
<tbody>
<tr>
  <th>Field Type</th>
  <th>Record Definition</th>
  <th>Marshalled Record<br/>(Field Value is Null)</th>
</tr>
<tr>
  <td rowSpan="3"><pre>element</pre></td>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
        &lt;field name="name" /&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td>
    <pre>
    &lt;person&gt;
        &lt;name/&gt;
    &lt;/person&gt;
    </pre>
</td>
</tr>
<tr>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
        &lt;field name="name" <span className="highlight">minOccurs="0"</span> /&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td><pre>&lt;person/&gt;</pre></td>
</tr>
<tr>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
        &lt;field name="name" <span className="highlight">nillable="true"</span>/&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td>
    <pre>
    &lt;person&gt;
        &lt;name xsi:nil="true"/&gt;
    &lt;/person&gt;
    </pre>
</td>
</tr>
<tr>
  <td rowSpan="2"><pre>attribute</pre></td>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
        &lt;field name="name" <span className="highlight">xmlType="attribute"</span>/&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td><pre>&lt;person/&gt;</pre></td>
</tr>
<tr>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
        &lt;field name="name" <span className="highlight">xmlType="attribute" minOccurs="1"</span>/&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td><pre>&lt;person name=""/&gt;</pre></td>
</tr>
<tr>
  <td><pre>text</pre></td>
  <td>
    <pre>
    &lt;record name="person" className="map"&gt;
    &lt;field name="name" <span className="highlight">xmlType="text"</span>/&gt;
    &lt;/record&gt;
    </pre>
  </td>
  <td><pre>&lt;person/&gt;</pre></td>
</tr>
</tbody>
</table>

### 5.8. Segments

A segment can be used to bind a group of fields to a nested bean object, or to wrap a field or group of fields under an
XML element.

#### 5.8.1. Nested Beans

Segments can be used to bind a group of fields to a bean object. The `xmlType` assigned to the segment determines the
format of the XML. Possible values are `element` (default) and `none`. The difference can be explored using the Address
and Employee beans defined in Section 4.4 and repeated here.

```java
package example;

public class Address {
    String street;
    String city;
    String state;
    String zip;

    // getters and setters not shown...
}
```

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    Address mailingAddress;

    // getters and setters not shown...
}
```

By default, a segment's `xmlType` is set to `element`, so it is not necessary to declare it in the mapping file below.

```xml
<beanio>

  <stream name="employeeFile" format="xml">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
      <segment name="mailingAddress" class="example.Address" xmlType="element">
        <field name="street" />
        <field name="city" />
        <field name="state" />
        <field name="zip" />
      </segment>
    </record>
  </stream>

</beanio>
```

This mapping configuration can be used to process the sample XML document below. When a segment is mapped to an XML
element, `nillable` and `minOccurs` will control the marshalling behavior of null bean objects in the same fashion as a
field (see [Section 5.7.2](#NullFields)).

```xml
<?xml version="1.0"?>
<employeeFile>
  <employee>
    <firstName>Joe</firstName>
    <lastName>Smith</lastName>
    <title>Developer</title>
    <salary>75000</salary>
    <hireDate>2009-10-12</hireDate>
    <mailingAddress>
      <street>123 Main Street</street>
      <city>Chicago</city>
      <state>IL</state>
      <zip>12345</zip>
    </mailingAddress>
  </employee>
  .
  .
  .
</employeeFile>
```

Alternatively, if the segment's `xmlType` is set to `none`, the following XML document can be processed.

```xml
<?xml version="1.0"?>
<employeeFile>
  <employee>
    <firstName>Joe</firstName>
    <lastName>Smith</lastName>
    <title>Developer</title>
    <salary>75000</salary>
    <hireDate>2009-10-12</hireDate>
    <street>123 Main Street</street>
    <city>Chicago</city>
    <state>IL</state>
    <zip>12345</zip>
  </employee>
  .
  .
  .
</employeeFile>
```

#### 5.8.2. Wrapped Segments

In some cases, an XML document may contain extraneous elements that do not map directly to a bean object or property
value. In these cases, a `segment` (without a `class` attribute) can be used to wrap a field or group of fields.

Extending the previous example, let's suppose the `Employee` bean object is modified to hold a list of addresses.

```java
package example;
import java.util.Date;

public class Employee {
    String firstName;
    String lastName;
    String title;
    int salary;
    Date hireDate;
    List<Address> addressList;

    // getters and setters not shown...
}
```

And let's further suppose that each employee's list of addresses is enclosed in a new element called `addresses`.

```xml
<?xml version="1.0"?>
<employeeFile>
  <employee>
    <firstName>Joe</firstName>
    <lastName>Smith</lastName>
    <title>Developer</title>
    <salary>75000</salary>
    <hireDate>2009-10-12</hireDate>
    <addresses>
      <mailingAddress>
        <street>123 Main Street</street>
        <city>Chicago</city>
        <state>IL</state>
        <zip>12345</zip>
      </mailingAddress>
    </addresses>
  </employee>
  .
  .
  .
</employeeFile>
```

The mapping file can now be updated as follows:

```xml
<beanio>

  <stream name="employeeFile" format="xml">
    <record name="employee" class="example.Employee">
      <field name="firstName" />
      <field name="lastName" />
      <field name="title" />
      <field name="salary" />
      <field name="hireDate" type="date" />
      <segment name="addresses">
        <segment name="mailingAddress" class="example.Address" collection="list" minOccurs="0" maxOccurs="unbounded">
          <field name="street" />
          <field name="city" />
          <field name="state" />
          <field name="zip" />
        </segment>
      </segment>
    </record>
  </stream>

</beanio>
```

The following table illustrates various effects using a segment based on the `xmlType` of a field, and the effect
of `minOccurs` and `nillable` when marshalling null field values.

<table className="indent">
<tbody>
<tr>
  <th>Field Mapping</th>
  <th>Non-Null Field Value</th>
  <th>Null Field Value</th>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" /&gt;
&lt;/segment&gt;</pre></td>
  <td rowSpan="5"><pre>&lt;wrapper&gt;
  &lt;field&gt;value&lt;/field&gt;
&lt;/wrapper&gt;</pre></td>
  <td><pre>&lt;wrapper&gt;
  &lt;field/&gt;
&lt;/wrapper&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">minOccurs="0"</span>&gt;
  &lt;field name="field" /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>-</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">nillable="true"</span>&gt;
  &lt;field name="field" /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>&lt;wrapper xsi:nil="true"/&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" <span className="highlight">nillable="true"</span> /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>&lt;wrapper&gt;
  &lt;field xsi:nil="true"/&gt;
&lt;/wrapper&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" <span className="highlight">minOccurs="0"</span>/&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>&lt;wrapper/&gt;</pre></td>
</tr>

<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" xmlType="attribute" /&gt;
&lt;/segment&gt;</pre></td>
  <td rowSpan="3"><pre>&lt;wrapper field="value"/&gt;</pre></td>
  <td><pre>&lt;wrapper/&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" xmlType="attribute" <span className="highlight">minOccurs="1"</span> /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>&lt;wrapper field=""/&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">minOccurs="0"</span>&gt;
  &lt;field name="field" xmlType="attribute" minOccurs="1" /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>-</pre></td>
</tr>

<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" xmlType="text" /&gt;
&lt;/segment&gt;</pre></td>
  <td rowSpan="3"><pre>&lt;wrapper&gt;value&lt;/wrapper&gt;</pre></td>
  <td><pre>&lt;wrapper/&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">nillable="true"</span>&gt;
  &lt;field name="field" xmlType="text" /&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>&lt;wrapper xsi:nil="true"/&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">minOccurs="0"</span>&gt;
  &lt;field name="field" xmlType="text"/&gt;
&lt;/segment&gt;</pre></td>
  <td><pre>-</pre></td>
</tr>
</tbody>
</table>

Similarly, a `segment` can be used to wrap a repeating field as illustrated below.

<table className="indent">
<tbody>
<tr>
  <th>Field Mapping</th>
  <th>Collection</th>
  <th>Null or Empty Collection</th>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" collection="list"
    <span className="highlight">minOccurs="0"</span> maxOccurs="10" /&gt;
&lt;/segment name="wrapper"&gt;</pre></td>
  <td rowSpan="4"><pre>&lt;wrapper&gt;
  &lt;field&gt;value1&lt;/field&gt;
  &lt;field&gt;value2&lt;/field&gt;
&lt;/wrapper&gt;</pre></td>
  <td><pre>&lt;wrapper /&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper"&gt;
  &lt;field name="field" collection="list"
    <span className="highlight">minOccurs="1"</span> maxOccurs="10" /&gt;
&lt;/wrapper&gt;</pre></td>
  <td><pre>&lt;wrapper&gt;
  &lt;field/&gt;
&lt;/wrapper&gt;</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">minOccurs="0"</span>&gt;
  &lt;field name="field" collection="list"
    minOccurs="1" maxOccurs="10" /&gt;
&lt;/wrapper&gt;</pre></td>
  <td><pre>-</pre></td>
</tr>
<tr>
  <td><pre>&lt;segment name="wrapper" <span className="highlight">nillable="true"</span>&gt;
  &lt;field name="field" collection="list"
    minOccurs="1" maxOccurs="10" /&gt;
&lt;/wrapper&gt;</pre></td>
  <td><pre>&lt;wrapper xsi:nil="true"/&gt;</pre></td>
</tr>
</tbody>
</table>

## 6.0. Annotations and the Stream Builder API

Since release 2.1, BeanIO includes support for Java annotations and a stream builder API.

### 6.1. The Stream Builder API

The stream builder API can be used to programatically create a stream mapping without the need for a mapping file.

```java
    StreamFactory factory = StreamFactory.newInstance();

    // create a new StreamBuilder and define its layout
    StreamBuilder builder = new StreamBuilder("employeeFile")
        .format("delimited")
        .parser(new DelimitedParserBuilder(','))
        .addRecord(new RecordBuilder("employee")
            .type(Employee.class)
            .minOccurs(1)
            .addField(new FieldBuilder("type").rid().literal("EMP").ignore())
            .addField(new FieldBuilder("recordType").rid(
            .addField(new FieldBuilder("firstName"))
            .addField(new FieldBuilder("lastName"))
            .addField(new FieldBuilder("title"))
            .addField(new FieldBuilder("salary"))
            .addField(new FieldBuilder("hireDate").format("MMddyyyy")));

    // pass the StreamBuilder to the factory
    factory.define(builder);

    BeanReader in = factory.createReader("employeeFile", new File("employee.csv"));
    // etc...
```

Like in a mapping file, components are assumed to be ordered as they are added to their parent, unless `at` (for fields)
or `order` (for records and groups) is explicitly set. For more information, refer to the Javadocs for
the [`org.beanio.builder`](https://beanio.github.io/api/org/beanio/builder/package-summary.html) package.

### 6.2. Annotations

Java classes can also be annotated to augment the use of the stream builder API or mapping file. Classes may be
annotated with `@Record`, and class attributes or getter/setter methods may be annotated with `@Field`. Any component
annotated with `@Record` or `@Segment` may be further annotated using `@Fields` to include fields not bound to a Java
property.

Continuing our previous example, the `example.Employee` class could be annotated like so:

```java
@Record(minOccurs=1}
@Fields({
    @Field(name="type", at=0, rid=true, literal="EMP")
})
public class Employee {

    @Field(at=1)
    private String firstName;
    @Field(at=2)
    private String lastName;
    @Field(at=3)
    private String title;
    @Field(at=4)
    private String salary,
    @Field(at=5, format="MMddyyyy")
    private Date hireDate;

    // getters and setters...
}
```

Using an annotated `Employee` class, the stream builder example can be greatly simplified:

```java
    StreamFactory factory = StreamFactory.newInstance();

    StreamBuilder builder = new StreamBuilder("employeeFile")
        .format("delimited")
        .parser(new DelimitedParserBuilder(','))
        .addRecord(Employee.class);

    factory.define(builder);
```

As can a mapping file:

```xml
<beanio>

  <stream name="employeeFile" format="delimited">
    <parser>
      <property name="delimiter" value="," />
    </parser>
    <record name="employee" class="example.Employee" />
  </stream>

</beanio>
```

When using annotations, it is strongly recommended to explicitly set the position (using `at`) for all fields and
segments. BeanIO does not guarrantee the order in which annotated components are added to a layout.

Annotation settings are generally named according to their mapping file counterparts and follow the same convention as
well. Refer to [Appendix A](#A) for a complete explanation of all settings.

Where used, annotated records can not be overridden by mapping file components. Configuration settings other
than `class` and descendent components will be ignored.

## 8.0. Configuration

In some cases, BeanIO behavior can be controlled by setting optional property values. Properties can be set using System
properties or a property file. BeanIO will load configuration setting in the following order of priority:

1. System properties.
2. A property file named `beanio.properties`. The file will be looked for first in the application's working directory,
   and then on the classpath.

The name and location of `beanio.properties` can be overridden using the System property `org.beanio.configuration`. In
the following example, configuration settings will be loaded from the file named `config/settings.properties`, first
relative to the application's working directory, and if not found, then from the root of the application's classpath.

```shell
java -Dorg.beanio.configuration=config/settings.properties example.Main
```

### 8.1. Settings

The following configuration settings are supported by BeanIO:

<table className="indent">
<tbody>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Default</th>
</tr>
<tr>
  <td><code>org.beanio.allowProtectedAccess</code></td>
  <td>Whether private and protected class variables and constructors can be accessed (i.e.
    make accessible using the reflection API).</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.lazyIfEmpty</code></td>
  <td>Whether objects are lazily instantiated if String properties are empty (and not just null).</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.errorIfNullPrimitive</code></td>
  <td>Whether null field values will cause an exception if bound to a primitive property.</td>
  <td><code>false</code></td>
</tr>
<tr>
  <td><code>org.beanio.useDefaultIfMissing</code></td>
  <td>Whether default values apply to fields missing from the stream.</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.propertyEscapingEnabled</code></td>
  <td>Whether <a href="#property"><code>property</code></a> values (for <code>typeHandler</code>, <code>reader</code>
    and <code>writer</code> elements) support escape patterns for line feeds, carriage returns, tabs, etc.
    Set to <code>true</code> or <code>false</code>.</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.nullEscapingEnabled</code></td>
  <td>Whether the null character can be escaped using <code>\0</code> when property escaping is enabled.
    Set to <code>true</code> or <code>false</code>.</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.marshalDefaultEnabled</code></td>
  <td>Whether a configured <a href="#field"><code>field</code></a> default is marshalled for null property values.
    May be disabled for backwards compatibility by setting the value to <code>false</code>.</td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>org.beanio.defaultTypeHandlerLocale</code></td>
  <td>Sets the default type handler locale.</td>
  <td><code>Locale.getDefault()</code></td>
</tr>

<tr>
  <td><code>org.beanio.defaultDateFormat</code></td>
  <td>Sets the default <code>SimpleDateFormat</code> pattern for <code>date</code> and
    <code>calendar-date</code> type fields in
    CSV, delimited and fixed length file formats.</td>
  <td><code>DateFormat. getDateInstance()</code></td>
</tr>
<tr>
  <td><code>org.beanio.defaultDateTimeFormat</code></td>
  <td>Sets the default <code>SimpleDateFormat</code> pattern for <code>datetime</code>,
    <code>calendar-datetime</code> and <code>calendar</code> type fields in
    CSV, delimited and fixed length file formats..</td>
  <td><code>DateFormat. getDateTimeInstance()</code></td>
</tr>
<tr>
  <td><code>org.beanio.defaultTimeFormat</code></td>
  <td>Sets the default <code>SimpleDateFormat</code> pattern for <code>time</code> and
    <code>calendar-time</code> type fields in
    CSV, delimited and fixed length file formats..</td>
  <td><code>DateFormat. getTimeInstance()</code></td>
</tr>
<tr>
  <td><code>org.beanio.group.minOccurs</code></td>
  <td>Sets the default <code>minOccurs</code> for a <a href="#group"><code>group</code></a>.</td>
  <td><code>0</code></td>
</tr>
<tr>
  <td><code>org.beanio.record.minOccurs</code></td>
  <td>Sets the default <code>minOccurs</code> for a <a href="#record"><code>record</code></a>.</td>
  <td><code>0</code></td>
</tr>
<tr>
  <td><code>org.beanio.field.minOccurs.[format]</code></td>
  <td>Sets the default <code>minOccurs</code> for a <a href="#field"><code>field</code></a> by stream format.</td>
  <td><code>1</code></td>
</tr>
<tr>
  <td><code>org.beanio.propertyAccessorFactory </code></td>
  <td>Sets the method of property invocation to use. Defaults to <code>reflection</code>.</td>
</tr>
<tr>
  <td><code>org.beanio.xml.defaultXmlType</code></td>
  <td>Sets the default XML type for a field in an XML formatted stream.  May be set
    to <code>element</code> or <code>attribute</code>.</td>
  <td><code>element</code></td>
</tr>
<tr>
  <td><code>org.beanio.xml.xsiNamespacePrefix</code></td>
  <td>Sets the default prefix for the namespace <code>http://www.w3.org/2001/XMLSchema-instance</code>.</td>
  <td><code>xsi</code></td>
</tr>
<tr>
  <td><code>org.beanio.xml.sorted</code></td>
  <td>Whether XML fields are sorted by position (if assigned).</td>
  <td><code>true</code></td>
</tr>
</tbody>
</table>


## Appendix A: XML Mapping File Reference

Appendix A is the complete reference for the BeanIO 2.x XML mapping file schema. The root element of a mapping file
is `[beanio](#beanio)` with namespace `http://www.beanio.org/2012/03`. The following notation is used to indicate the
allowed number of child elements:

\* Zero, one or more  
\+ One or more  
? Zero or one

##### Ranges

Where noted, some attributes can be configured using a range notation. A range is expressed using the following syntax,
where N and M are integer values:

<table className="indent" border="0">
<tbody>
  <tr><td>N</td><td>Upper and lower boundaries are set to N.</td></tr>
  <tr><td>N-M</td><td>Lower boundery is set to N.  Upper boundary is set to M.</td></tr>
  <tr><td>N+</td><td>Lower boundary is set to N.  No upper boundary.</td></tr>
</tbody>
</table>

### A.1. `beanio`

The `beanio` element is the root element for a BeanIO mapping file.

Children: [`property`](#property)\*, [`import`](#import)\*, [`typeHandler`](#typeHandler)\*, [`template`](#template)
\*, [`stream`](#stream)\*

### A.2. `import`

The `import` element is used to import type handlers, templates and streams from an external mapping file. Streams
declared in a mapping file being imported are not affected by global type handlers or templates declared in the file
that imported it.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>resource</code></td>
  <td>The name of the resource to import.
    <p>The resource name must be qualified with 'classpath:' to load the resource from
    the classpath, or with 'file:' to load the file relative to the application's working
    directory.</p></td>
  <td>Yes</td>
</tr>
</tbody>
</table>


### A.3. `typeHandler`

A `typeHandler` element is used to declare a custom field type handler that implements
the [`org.beanio.types.TypeHandler`](https://beanio.github.io/api/org/beanio/types/TypeHandler.html) interface. A type
handler can be registered for a specific Java type, or registered for a Java type and stream format combination, or
explicitly named.

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The type handler name.  A <a href="#field">field</a> can always reference a type
    handler by name, even if the stream format does not match the
    configured type handler <code>format</code> attribute.
    <p>When configured, the name of a globally declared type handler must be unique
      within a mapping and any imported mapping files.</p></td>
  <td>One of <code>name</code> or <code>type</code> is required.</td>
</tr>
<tr>
  <td><code>type</code></td>
  <td>The fully qualified classname or type alias to register the type handler for.
    If <code>format</code> is also set, the type handler will only be used
    by streams that match the configured format.</td>
  <td>One of <code>name</code> or <code>type</code> is required.</td>
</tr>
<tr>
  <td><code>class</code></td>
  <td>The fully qualified classname of the <code>TypeHandler</code> implementation.</td>
  <td>Yes</td>
</tr>
<tr>
  <td><code>format</code></td>
  <td>When used in conjunction with the <code>type</code> attribute, a type handler can be
    registered for a specific stream format.  Set to <code>xml</code>, <code>csv</code>,
    <code>delimited</code>, or <code>fixedlength</code>.  If not set, the type handler may be
    used by any stream format.</td>
  <td>No</td>
</tr>
</tbody>
</table>

Children: [`property`](#property)\*

### A.4. `property`

A `property` element has several uses.

1. When used at the top of a mapping file as a direct child of [`beanio`](#beanio), a `property` may declare properties
   to use for property substitution in other attributes within the mapping file. Property substitution uses the
   syntax `${propertyName,default}`, where all whitespace between the brackets is retained. Properties cannot be
   imported from another file.
2. Or, a `property` element may be used to customize other elements, such as a [`typeHandler`](#typeHandler)
   or [`parser`](#parser).
3. Or finally, a `property` value can be used to set constant values on a bean object, which is further described below.

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The property name.</td>
  <td>Yes</td>
</tr>
<tr>
  <td><code>value</code></td>
  <td>
    The property value.
    <p>When used to customize a <a href="#typeHandler"><code>typeHandler</code></a>
      or <a href="#parser"><code>parser</code></a>, default type handlers only are used to convert
      property text to an object value.  String and Character type property values can use the following escape
      sequences: <code>\\</code> (Backslash), <code>\n</code> (Line Feed), <code>\r</code> (Carriage Return), <code>\t</code> (Tab),
      <code>\0</code> (Null) and <code>\f</code> (Form Feed).  A backslash preceding any other character is ignored.</p>
  </td>
  <td>Yes</td>
</tr>
</tbody>
</table>

A `property` element, when used as child of a [`record`](#record) or [`segment`](#segment) element, can be used to set
constant values on a record or bean object that do not map to a field in the input or output stream. The following
additional attributes are accepted in this scenario:

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Format(s)</th>
</tr>
<tr>
  <td><code>getter</code></td>
  <td>The getter method used to retrieve the property value from its parent bean class.
    By default, the getter method is determined through introspection using
    the property name.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>setter</code></td>
  <td>The setter method used to set the property value on its parent bean class.
    By default, the setter method is determined through introspection using
    the property name.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>rid</code></td>
  <td>Record identifier indicator for marshalling/writing only.  Set to <code>true</code> if this property is
    used to identify the record mapping configuration used to marshall a bean object.
    More than one property or field can be used for identification.  Defaults to <code>false</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>type</code></td>
  <td>The fully qualified class name or type alias of the property value.  By default,
    BeanIO will derive the property type from the bean class.  This attribute
    can be used to override the default or may be required if the bean class
    is of type <code>Map</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>typeHandler</code></td>
  <td>The name of the type handler to use for type conversion.  By default, BeanIO
    will select a type handler based on <code>type</code> when set, or through
    introspection of the property's parent bean class.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>format</code></td>
  <td>
    The decimal format pattern for <code>Number</code> type properties, or the simple
    date format pattern for <code>Date</code> type properties.
    <p>The <code>format</code> value can accessed by any custom type handler that
    implements <code>ConfigurableTypeHandler</code>.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
</tbody>
</table>

### A.5. `template`

The `template` element is used to create reusable lists of bean properties.

Note that templates are "expanded" at the time they are included. This means an imported template that relies on
property substitution will use property values from the mapping file that included it and not the mapping file where the
template was declared.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of the template.  Template names must be unique within a mapping file
    and any imported mapping files.</td>
  <td>Yes</td>
</tr>
</tbody>
</table>

Children: ( [`field`](#field) | [`property`](#property) | [`segment`](#segment) | [`include`](#include) )\*

### A.6. `include`

The `include` element is used to include a template in a [`record`](#record), [`segment`](#segment), or
another [`template`](#template).

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>template</code></td>
  <td>The name of the template to include.</td>
  <td>Yes</td>
</tr>
<tr>
  <td><code>offset</code></td>
  <td>The offset added to field positions included by the template.  Defaults to 0. </td>
  <td>No</td>
</tr>
</tbody>
</table>

### A.7. `stream`

A `stream` element defines the record layout of an input or output stream.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Format(s)</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of the stream.</td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>format</code></td>
  <td>The stream format.  Either <code>xml</code>, <code>csv</code>, <code>delimited</code> or
    <code>fixedlength</code></td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>mode</code></td>
  <td>
    By default, a stream mapping can be used for both reading input streams and writing
    output streams, called <code>readwrite</code> mode.  Setting mode to <code>read</code> or
    <code>write</code> instead, respectively restricts usage to a <code>BeanReader</code> or a
    <code>BeanWriter</code> only, but relaxes some validations on the mapping configuration.
    <p>When mode is set to <code>read</code>, a bean class does not require getter methods. </p>
    <p>When mode is set to <code>write</code>, a bean class may be abstract or an interface, and does
      not require setter methods.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>resourceBundle</code></td>
  <td>The name of the resource bundle for customizing error messages.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>strict</code></td>
  <td>When set to <code>true</code>, BeanIO will calculate and enforce record ordering
    based on the order records are declared.  The record <code>order</code> attribute can
    still be used to override a particular section of the stream.
    <p>When set to <code>true</code>, BeanIO will also calculate and enforce record
    lengths based on configured fields and their occurrences.  The record <code>minLength</code>
    and <code>maxLength</code> attributes can still be used to override BeanIO defaults.</p>
    <p>Defaults to <code>false</code>.</p></td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>The minimum number of times the record layout must be read from an
    input stream.  Defaults to <code>0</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxOccurs</code></td>
  <td>The maximum number of times the record layout can repeat when read from an
    input stream.  Defaults to <code>1</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occurs</code></td>
  <td>An alternative to specifying both <code>minOccurs</code> and <code>maxOccurs</code>
    that uses <a href="#range">range notation</a>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>ignoreUnidentified Records</code></td>
  <td>
    If set to true, BeanIO will skip records that cannot be identified, otherwise
    an <code>UnidentifiedRecordException</code> is thrown.  This feature is not recommended
    for use with record groups, since a record sequencing error could cause large portions
    of a stream to go unprocessed without any exception.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>xmlType</code></td>
  <td>The XML node type mapped to the stream.
  If not specified or set to <code>element</code>, the stream is mapped to the root element of the
  XML document being marshalled or unmarshalled.  If set to <code>none</code>, the XML input stream
  will be fully read and mapped to a child <a href="#group"><code>group</code></a> or
  <a href="#record"><code>record</code></a>.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlName</code></td>
  <td>The local name of the XML element mapped to the stream.  Defaults to the stream name.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlNamespace</code></td>
  <td>The namespace of the XML element mapped to the stream.  Defaults to '*' which will ignore
    namespaces while marshalling and unmarshalling.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlPrefix</code></td>
  <td>The namespace prefix assigned to the declared <code>xmlNamespace</code> for marshalling XML.
    If not specified, the default namespace (i.e. <code>xmlns="..."</code>) is used.</td>
  <td>No</td>
  <td>xml</td>
</tr>
</tbody>
</table>

Children: [`parser`](#parser)?, [`typeHandler`](#typeHandler)\*, ( [`record`](#record) | [`group`](#group) )+

### A.8. `parser`

A `parser` element is used to customize or replace the default record parser factory for a stream.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
</tr>
<tr>
  <td><code>class</code></td>
  <td>
    The fully qualified class name of the <a href="/api/org/beanio/stream/RecordParserFactory.html">
    <code>org.beanio.stream.RecordParserFactory</code></a> implementation
    to use for this stream.  If not specified, one of the following default factories is
    used based on the stream format:<br />
    <br />csv - <a href="/api/org/beanio/stream/csv/CsvRecordParserFactory.html"><code>org.beanio.stream.csv.CsvRecordParserFactory</code></a>
    <br />delimited - <a href="/api/org/beanio/stream/delimited/DelimitedRecordParserFactory.html"><code>org.beanio.stream.delimited.DelimitedRecordParserFactory</code></a>
    <br />fixedlength - <a href="/api/org/beanio/stream/fixedlength/FixedLengthRecordParserFactory.html"><code>org.beanio.stream.fixedlength.FixedLengthRecordParserFactory</code></a>
    <br />xml - <a href="/api/org/beanio/stream/xml/XmlRecordParserFactory.html"><code>org.beanio.stream.xml.XmlRecordParserFactory</code></a>
    <p>Overriding the record parser factory for XML is not supported (but also not prevented).</p>
  </td>
  <td>No</td>
</tr>
</tbody>
</table>

Children: [`property`](#property)\*

### A.9. `group`

A `group` element is used to group records together for validating occurrences of the group as a whole.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Format(s)</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of the group.</td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>class</code></td>
  <td>
    The fully qualified class name of the bean object mapped to this group.  A <code>class</code>
    may be bound to a group when its marshalled form spans multiple consecutive records.
    <p>During umarshalling, if any record in the group fails validation, an
    <code>InvalidRecordGroupException</code> is thrown.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>value<br /><del>target</del></code></td>
  <td>
    The name of a child component (typically a record) to return in lieu of an assigned class.
    <p>There can be only one iteration of the named value.  For example, if a repeating segment
    bound to a collection contains a repeating field (also bound to a collection), the segment
    can be targeted, but the field cannot.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>collection</code></td>
  <td>
    The collection type for repeating groups bound to a parent bean object (configured on
    a <a href="#group"><code>group</code></a>).  The value may be set to any fully qualified class name
    assignable to <code>java.util.Collection</code>,
    or to one of the collection type aliases: <code>list</code>, <code>set</code> or <code>array</code>.
    A collection type can only be set if <code>class</code> is also set.
    <p>BeanIO will not derive the collection type from it's parent bean object.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>getter</code></td>
  <td>The getter method used to get the bean object bound to this group from
    it's parent.  By default, the getter method is determined through introspection using
    the group name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>setter</code></td>
  <td>The setter method used to set the bean object bound to this group on the bean object of
    it's parent.  By default, the setter method is determined through introspection using
    the group name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>order</code></td>
  <td>
    The order this group must appear within its parent group or stream.
    <p>If <code>strict</code> is set to true at the stream level, <code>order</code> will default
    to the order assigned to its preceding sibling plus one (i.e. the record or group that
    shares the same parent), or 1 if this group is the first child in its parent group or stream.
    If <code>strict</code> is false, defaults to 1.</p>

    <p>If <code>order</code> is explicitly set for one group, it must be set for all other siblings
    that share the same parent.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>The minimum number of occurences of this group within its parent group or stream.
    Defaults to 1.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxOccurs</code></td>
  <td>The maximum number of occurences of this group within its parent group or stream.
    Defaults to <code>unbounded</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occurs</code></td>
  <td>An alternative to specifying both <code>minOccurs</code> and <code>maxOccurs</code>
    that uses <a href="#range">range notation</a>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>xmlType</code></td>
  <td>The XML node type mapped to this group.
  If not specified or set to <code>element</code>, this group is mapped to an XML element.  When set to
  <code>none</code>, this group is used only to define expected record sequencing.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlName</code></td>
  <td>The local name of the XML element mapped to this group.  Defaults to the group name.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlNamespace</code></td>
  <td>The namespace of the XML element mapped to this group.  Defaults to the namespace declared for the
    parent stream or group definition.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlPrefix</code></td>
  <td>The namespace prefix assigned to the declared <code>xmlNamespace</code> for marshalling XML.
    If not specified, the default namespace is used (i.e. <code>xmlns="..."</code>).</td>
  <td>No</td>
  <td>xml</td>
</tr>
</tbody>
</table>

Children: [`record`](#record)\*

### A.10. `record`

A `record` is used to define a record mapping within a stream.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Format(s)</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of the record.</td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>class</code></td>
  <td>
    The fully qualified class name of the bean object mapped to this record.
    <p>If set to <code>map</code> or
    any <code>java.util.Map</code> implementation, a Map object will be used with field names
    for keys and field values for values.</p>
    <p>If set to <code>list</code>, <code>set</code>, <code>collection</code>, or any <code>java.util.Collection</code>
    implementation, child fields are added to the declared collection, including null values for
    missing or null fields.</p>
    <p>If neither <code>class</code> or <code>target</code> is set, a <code>BeanReader</code> will fully
    validate the record, but no bean object will be returned and the reader will continue reading
    the next record.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>value<br /><del>target</del></code></td>
  <td>
    The name of a child segment or field to return in lieu of an assigned class.
    <p>There can be only one iteration of a named value.  For example, if a repeating segment
    bound to a collection contains a repeating field (also bound to a collection), the segment
    can be targeted, but the field cannot.</p>
    <p>If neither <code>class</code> or <code>value</code> is set, a <code>BeanReader</code> will fully
    validate the record, but no bean object will be returned and the reader will continue reading
    the next record.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>getter</code></td>
  <td>The getter method used to get the bean object bound to this record from
    it's parent.  By default, the getter method is determined through introspection using
    the record name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>setter</code></td>
  <td>The setter method used to set the bean object bound to this record on the bean object of
    it's parent.  By default, the setter method is determined through introspection using
    the record name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>collection</code></td>
  <td>
    The collection type for repeating records bound to a parent bean object (configured on
    a <a href="#group"><code>group</code></a>).  The value may be set to any fully qualified class name
    assignable to <code>java.util.Collection</code> or <code>java.util.Map</code>,
    or to one of the collection type aliases: <code>list</code>, <code>set</code>, <code>map</code> or <code>array</code>.
    A collection type can only be set if <code>class</code> or <code>target</code> is also set.
    <p>BeanIO will not derive the collection type from it's parent bean object.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>key</code></td>
  <td>The name of a descendant field to use for the Map key when <code>collection</code>
    is assignable to a <code>java.util.Map</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>order</code></td>
  <td>
    The order this record must appear within its parent group or stream.
    <p>If <code>strict</code> is set to true at the stream level, <code>order</code> will default
    to the order assigned to its preceding sibling plus one (i.e. the record or group that
    shares the same parent), or 1 if this record is the first child in its parent group or stream.
    If <code>strict</code> is false, defaults to 1.</p>

    <p>If <code>order</code> is explicitly set for one record, it must be set for all other siblings
    that share the same parent.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>The minimum number of occurences of this record within its parent group or stream.
    Defaults to 0.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxOccurs</code></td>
  <td>The maximum number of occurrences of this record within its parent group or stream.
    Defaults to <code>unbounded</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occurs</code></td>
  <td>An alternative to specifying both <code>minOccurs</code> and <code>maxOccurs</code>
    that uses <a href="#range">range notation</a>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>lazy</code></td>
  <td>
    If set to <code>true</code>, the class or collection bound to this record will only be
    instantiated if at least one child attribute is not null or the empty String.
    Defaults to <code>false</code>.  [Only applies if this record is bound to an attribute
    of a parent group.]
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>template</code></td>
  <td>The name of the template to include.  The template is added to the record layout
    before any child of this record.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>ridLength</code></td>
  <td>
    The expected length of this record for identifying it.  The value uses
    <a href="#range">range notation</a>.
    <p>If the stream format is <code>delimited</code> or <code>csv</code>, record length is measured by
     number of fields.  If the stream format is <code>fixedlength</code>, record length is measured in characters.</p>
    </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>minLength</code></td>
  <td>
    If the stream format is <code>delimited</code> or <code>csv</code>, <code>minLength</code> is the minimum number
    of fields required by this record.  If <code>strict</code> is true, defaults to the number of fields defined
    for the record, otherwise 0.
    <p>If the stream format is <code>fixedlength</code>, <code>minLength</code> is the minimum number
    of characters required by this record.  If <code>strict</code> is true, defaults to the sum of all field lengths
    definied for the record, otherwise 0.</p>
    </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>maxLength</code></td>
  <td>
    If the stream format is <code>delimited</code> or <code>csv</code>, <code>maxLength</code> is the maximum number
    of fields allowed by this record.  If <code>strict</code> is true, defaults to the number of fields defined
    for the record, or if no fields are declared or <code>strict</code> is false, then <code>unbounded</code>.
    <p>If the stream format is <code>fixedlength</code>, <code>maxLength</code> is the maximum number
    of characters allowed by this record.  If <code>strict</code> is true, defaults to the sum of all field lengths
    defined for the record, or if no fields are declared or <code>strict</code> is false, then <code>unbounded</code>.</p>
    </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>xmlName</code></td>
  <td>The local name of the XML element mapped to this record.  Defaults to the record name.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlNamespace</code></td>
  <td>The namespace of the XML element mapped to this record.  Defaults to the namespace declared for
    this record's parent group or stream.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlPrefix</code></td>
  <td>The namespace prefix assigned to the declared <code>xmlNamespace</code> for marshalling XML.
    If not specified, the default namespace is used (i.e. <code>xmlns="..."</code>).</td>
  <td>No</td>
  <td>xml</td>
</tr>
</tbody>
</table>

Children: ( [`field`](#field) | [`property`](#property) | [`segment`](#segment) | [`include`](#include) )\*

### A.11. `segment`

A `segment` is used to bind groups of fields to a nested bean object, or to validate repeating groups of fields, or in
an XML formatted stream, to wrap one or more fields in an element.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Format(s)</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of the segment.  If the segment is bound to a bean object, the segment
    name is used for the name of the bean property unless a <code>getter</code> or <code>setter</code>
    is set.</td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>class</code></td>
  <td>
    The fully qualified class name of the bean object bound to this segment.
    If set to <code>map</code> or any <code>java.util.Map</code> implementation, a Map object will
    be used with field/segment names for keys and field/segment values for values.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>value</code><br/><del><code>target</code></del></td>
  <td>
    The name of a child segment or field to return in lieu of an assigned class.
    If set, all other descendants are not bound to the parent bean property.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>getter</code></td>
  <td>The getter method used to get the bean object bound to this segment from it's parent.
    By default, the getter method is determined through introspection using
    the segment name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>setter</code></td>
  <td>The setter method used to set the bean object bound to this segment on the bean object
    of it's parent.  By default, the setter method is determined through introspection using
    the segment name.  Ignored if <code>class</code> is not set.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>collection</code></td>
  <td>
    The collection type for repeating segments bound to a parent bean object.
    The value may be set to any fully qualified class name
    assignable to <code>java.util.Collection</code> or <code>java.util.Map</code>,
    or to one of the collection type aliases: <code>list</code>, <code>set</code>, <code>map</code>
    or <code>array</code>.
    A collection type can only be set if <code>class</code> or <code>target</code> is also set.
    <p>BeanIO will not derive the collection type from it's parent bean object.</p>
    <p>There are a few restrictions specific to repeating segments in any "flat" format (delimited, CSV or fixedlength):</p>
    <ul>
    <li>Repeating segments must appear in the stream consecutively.</li>
    <li>A repeating segment cannot contain repeating fields or segments where
      the length is indeterminate (i.e. where <code>minOccurs</code> does not match <code>maxOccurs</code>).</li>
    <li>Repeating segments must fully declare all child fields- there can be no gaps in the definition.
      (However, you can still skip over unbound values using the <code>ignore</code> field attribute.)</li>
    </ul>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>key</code></td>
  <td>
    The name of a descendant field to use for the Map key when <code>collection</code>
    is assignable to a <code>java.util.Map</code>.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>
    The minimum consecutive occurrences of this segment.  Defaults to 1.
    <p>If <code>minOccurs</code> is 0, a null bean object bound to this segment will
     not be marshalled (unless a subsequent field is marshalled for CSV, delimited and
     fixed legnth stream formats)</p>
    <p>During unmarshalling, if the configured minimum occurrences is not met,
      an <code>InvalidRecordException</code> is thrown.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxOccurs</code></td>
  <td>
    The maximum consecutive occurrences of this segment.  By default,
    <code>maxOccurs</code> is set to <code>minOccurs</code> or 1, whichever is greater.
    If there is no limit to the number of occurrences, the value may
    be set to <code>unbounded</code>.

    <p>If set for a CSV, delimited or fixed length stream, the value can only
    exceed <code>minOccurs</code> if the segment appears at the end of a record.  </p>
    <p>Maximum occurrences is not used for validation.  If bounded, the
      size of a bound collection will not exceed the configured value, and additional occurrences
      are ignored.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occurs</code></td>
  <td>An alternative to specifying both <code>minOccurs</code> and <code>maxOccurs</code>
    that uses <a href="#range">range notation</a>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occursRef</code></td>
  <td>
    The name of a preceding field in the same record that controls the number
    of occurrences of this segment.  If the controlling field is not bound to a
    separate property (i.e. <code>ignore="true"</code>), its automatically set based on the
    size of the segment collection during marshalling.
  </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>lazy</code></td>
  <td>
  If set to <code>true</code>, the class or collection bound to this segment will only be
    instantiated if at least one child attribute is not null or the empty String.
    Defaults to <code>false</code>.  This functionality differs from <code>minOccurs</code>
    in that the fields may still exist in the input stream.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>template</code></td>
  <td>The name of the template to include.  The template is added to the layout
    before any child of this segment.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>xmlType</code></td>
  <td>The XML node type mapped to this segment.
  If not specified or set to <code>element</code>, this bean is mapped to an XML element.  If set to
  <code>none</code>, children of this segment are expected to be contained by this segment's parent.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlName</code></td>
  <td>The local name of the XML element mapped to this segment.  Defaults to the segment name.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlNamespace</code></td>
  <td>The namespace of the XML element mapped to this segmnet.  Defaults to the namespace declared for the
    parent <a href="#record"><code>record</code></a> or <code>segmnet</code>.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlPrefix</code></td>
  <td>The namespace prefix assigned to the declared <code>xmlNamespace</code> for marshalling XML.
    If not specified, the default namespace is used (i.e. <code>xmlns="..."</code>).</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>nillable</code></td>
  <td>Set to <code>true</code> if the W3C Schema Instance attribute <code>nil</code> should be
    set to true when marshalling a null bean object.  Defaults to <code>false</code>.  During
    unmarshalling, a nillable element will cause an <code>InvalidRecordException</code> if <code>nillable</code>
    is false..</td>
  <td>No</td>
  <td>xml</td>
</tr>
</tbody>
</table>

Children: ( [`field`](#field) | [`property`](#property) | [`segment`](#segment) | [`include`](#include) )\*

### A.12. `field`

A `field` element is used to bind a field belonging to a record or segment to a bean property.

Attributes:

<table>
<tbody>
<tr>
  <th>Attribute</th>
  <th>Description</th>
  <th>Required</th>
  <th>Formats</th>
</tr>
<tr>
  <td><code>name</code></td>
  <td>The name of field.  Unless a getter and/or setter is defined, the field name is used
    for the bean property name.</td>
  <td>Yes</td>
  <td>*</td>
</tr>
<tr>
  <td><code>getter</code></td>
  <td>The getter method used to retrieve the property value for this field from its parent
    bean class.  By default, the getter method is determined through introspection using
    the field name.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>setter</code></td>
  <td>
    The setter method used to set the property value of this field on its parent bean class.
    By default, the setter method is determined through introspection using
    the field name.
    <p>If the field is a constructor argument, <code>setter</code> may be set to '#N', where
      N is the position of the argumnet in the constructor beginning at 1.</p>
    </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>rid</code></td>
  <td>
    Record identifier indicator.  Set to <code>true</code> if this field is used to identify a record.
    More than one field can be used to identify a record.  Defaults to <code>false</code>.
    <p>Record identifying fields must have <code>regex</code> or <code>literal</code> configured
    to match a record, unless the field is a named XML element or attribute.</p>
    </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>at</code><br /><code>position</code></td>
  <td>
    For delimited and CSV formatted streams, <code>position</code> (or <code>at</code>) is the index of the field
    within the record, beginning at 0.  And for fixed length formatted streams, <code>position</code>
    is the index of the first character of the field within the record, beginning at 0.
    <p>
    Negative numbers can be used to indicate the position is relative to the end of the record.
    For example, the position -2 indicates the second to last field in a delimited record.
    </p>
    <p>
    If the field repeats, or the field belongs to a segment that repeats,
    <code>position</code> should be set based on the first occurrence of the field in a record.
    </p>
    <p>
    A position must be specified for all fields in a record, or for none at all.  If positions
    are not specified, BeanIO will automatically calculate field positions based on the order
    in which the fields are defined in the mapping file.
    </p>
    <p>
    Position, if defined, is also used in XML formatted streams for ordering fields within
    their parent record or segment.  This is typically not needed when using a mapping file,
    but can be useful when using annotations.
    </p>
    <p>If a position is configured for a parent segment (with annotations), the positions declared
    for fields added to the segment are assumed to be relative to their parent.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>until</code></td>
  <td>
    The maximum position of the field in the record.  Only applies to fields that repeat
    where the number of occurrences is indeterminate (i.e. <code>maxOccurs</code> is greater
    than <code>minOccurs</code>).  <code>until</code> must always be specified relative to the end
    of the record, and is therefore always a negative number.
  </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>trim</code></td>
  <td>Set to <code>true</code> to trim the field text before validation and type
    conversion.  Defaults to <code>false</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>lazy</code></td>
  <td>
    Set to true to convert empty field text to null before type conversion.  For repeating
    fields bound to a collection, the collection will not be created if all field values
    are null or the empty String.  Defaults to false.
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>required</code></td>
  <td>Set to <code>true</code> if this field is required.  If a field is required and its field
    text is empty, a <code>BeanReader</code> will throw an <code>InvalidRecordException</code> when
    reading the record.  Defaults to <code>false</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minLength</code></td>
  <td>The minimum length of the field text before type conversion.  Minimum length is only
    validated if the field length is greater than 0.  Defaults to 0.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxLength</code></td>
  <td>The maximum length of the field text before type conversion.  Defaults to <code>unbounded</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>regex</code></td>
  <td>The regular expression pattern the field text must match.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>literal</code></td>
  <td>Sets the <i>literal</i> or constant value of this field.  When unmarshalled,
    an <code>InvalidRecordException</code> is thrown if the field text does not
    exactly match the literal value.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>default</code></td>
  <td>The default value of this field.
    <p>When unmarshalling a stream, this value is set on the bean object when the
    field text is null or the empty string.  And when marshalling, the
    default value is used when the property value is null or ignore is set to
    <code>true</code> (unless disabled).</p>
    <p>A default value is converted to a Java object using the same type
    handler configured for the field.</p></td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>type</code></td>
  <td>The fully qualified class name or type alias of the field value.  By default,
    BeanIO will derive the field type from its parent bean class.  This attribute
    can be used to override the default, or may be needed when its parent class
    is of type <code>java.util.Map</code>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>collection</code></td>
  <td>
    If a repeating field is bound to a collection object, <code>collection</code>
    is the fully qualified class name of the <code>java.util.Collection</code> implementation,
    or a collection type alias.  When a <code>collection</code> is configured, the <code>type</code> attribute
    is used to declare the property type of an item stored in the collection.
    May be set to <code>array</code> if the collection type is a Java array.
    <p>Repeating fields bound to a property value must have <code>collection</code> configured.
    BeanIO will not derive the collection type from a field's parent bean class.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>minOccurs</code></td>
  <td>
    The minimum consecutive occurrences of this field in a record.  Defaults to 1, with one
    exception: a field in an XML formatted stream bound to an attribute defaults to 0.

    <p><code>minOccurs</code> controls whether a field is marshalled for a null field value, and
     whether the field must be present during unmarshalling.  If <code>minOccurs</code> is 1 or
     greater and the field is not present during unmarshalling, an <code>InvalidRecordException</code> is thrown.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>maxOccurs</code></td>
  <td>
    The maximum consecutive occurrences of this field in a record.  By default,
    <code>maxOccurs</code> is set to <code>minOccurs</code> or 1, whichever is greater.  If overridden
    for a non-XML stream format, the value can only exceed <code>minOccurs</code> if this is the last field
    in the record.  The value may be set to <code>unbounded</code> if there is no limit to the
    number of occurrences of this field.
    <p>Maximum occurrences is not used for validation. When bounded, the size of a
    collection will not exceed the configured value, and additional occurrences are ignored.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occurs</code></td>
  <td>An alternative to specifying both <code>minOccurs</code> and <code>maxOccurs</code>
    that uses <a href="#range">range notation</a>.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>occursRef</code></td>
  <td>
    The name of a preceding field in the same record that controls the number
    of occurrences of this field.  If the controlling field is not bound to a
    separate property (i.e. <code>ignore="true"</code>), its automatically set based on the
    size of the field collection during marshalling.
  </td>
  <td>No</td>
  <td>csv, delimited, fixedlength</td>
</tr>
<tr>
  <td><code>format</code></td>
  <td>
    The decimal format pattern for <code>java.lang.Number</code> field values, or the simple
    date format pattern for <code>java.util.Date</code> field properties.
    <p>The <code>format</code> value can also be accessed by any custom type handler that
    implements <code>org.beanio.types.ConfigurableTypeHandler</code>.</p>
  </td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>typeHandler</code></td>
  <td>The name of the type handler to use for type conversion.  By default, BeanIO
    will select a type handler based on the field type when set, or through
    introspection of this field's parent bean class.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>ignore</code></td>
  <td>Set to <code>true</code> if this field is not a property of it's parent bean class.
    Defaults to <code>false</code>.  Note that any configured validation rule on an ignored
    field is still performed.</td>
  <td>No</td>
  <td>*</td>
</tr>
<tr>
  <td><code>length</code></td>
  <td>
    The padded length of this field measured in characters.  Length is required for fixed
    length formatted streams, and can be set for fields in other stream formats (along with
    a padding character) to enable field padding.
    <p>The length of the last field in a fixed length record may be set to <code>unbounded</code>
      to disable padding and allow a single variable length field at the end of the
      otherwise fixed length record.</p>
    </td>
  <td>Yes<sup>1</sup></td>
  <td><code>*</code></td>
</tr>
<tr>
  <td><code>padding</code></td>
  <td>
    The character used to pad this field.  For fixed length formatted streams,
    <code>padding</code> defaults to a space.  For non-fixed length formatted streams,
    padding is disabled unless a padding character and length are specified.

    <p>If padding is enabled, the <code>required</code> field attribute has some control over the
    marshalling and unmarshalling of null values.</p>

    <p>When unmarshalling a field consisting of all spaces in a fixed length stream,
    if <code>required</code> is false, the field
    is accepted regardless of the padding character.  If
    <code>required</code> is true, a required field validation error is triggered.  And when
    marshalling a null field value, if <code>required</code> is false,
    the field text is formatted as spaces regardless of the configured padding character.</p>

    <p>In other stream formats that are not fixed length, null field values are
    unmarshalled and marshalled as empty strings when <code>required</code> is false.
    When <code>required</code> is true, unmarshalling an empty string will trigger a required
    field validation error, and marshalling a null value will fill the field text with
    the padding character up to the padded length of the field.</p>
  </td>
  <td>No</td>
  <td><code>*</code></td>
</tr>
<tr>
  <td><code>keepPadding</code></td>
  <td>Set to <code>true</code> if field padding should not be removed when unmarshalling
    a fixed length field.  Defaults to <code>false</code>.</td>
  <td>No</td>
  <td>fixedlength</td>
</tr>
<tr>
  <td><code>lenientPadding</code></td>
  <td>Set to <code>true</code> to disable enforcement of the padded field length when
  unmarshalling a fixed length field.  Defaults to <code>false</code>.</td>
  <td>No</td>
  <td>fixedlength</td>
</tr>
<tr>
  <td><code>justify<br />align</code></td>
  <td>The justification (i.e. alignment) of the field text within its padding.  Either
    <code>left</code> or <code>right</code>.  Defaults to <code>left</code>.</td>
  <td>No</td>
  <td><code>*</code></td>
</tr>
<tr>
  <td><code>xmlType</code></td>
  <td>
  The XML node type mapped to this field.  The type can be set to <code>element</code> (default)
  to map this field to an XML element, <code>attribute</code> to map to an XML attribute, or <code>text</code>
  to map the field value to the enclosed text of it's parent record or segment.

  <p>When set to <code>text</code>, <code>xmlName</code> and <code>xmlNamespace</code> have no effect.</p>
  </td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlName</code></td>
  <td>The local name of the XML element or attribute mapped to this field.  Defaults to the field name.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlNamespace</code></td>
  <td>The namespace of the XML element mapped to this field.  Defaults to the namespace configured for it's
    immediate parent record or segment.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>xmlPrefix</code></td>
  <td>The namespace prefix assigned to the configured <code>xmlNamespace</code> for marshalling XML.
    If not specified, the default namespace (i.e. <code>xmlns="..."</code>) is used.</td>
  <td>No</td>
  <td>xml</td>
</tr>
<tr>
  <td><code>nillable</code></td>
  <td>
    Set to <code>true</code> if the W3C Schema Instance attribute <code>nil</code> should be
    set to true when the marshalled field value is null.  Defaults to <code>false</code>.
    Unmarshalling a non-nillalbe field where <code>nil="true"</code> will cause an
    <code>InvalidRecordException</code>.
  </td>
  <td>No</td>
  <td>xml</td>
</tr>
</tbody>
</table>

&nbsp;<sup>1</sup>Only required for fixed length fields. If a literal value is supplied for a fixed length field, `length` will default
to the length of the literal value.

## Appendix B: Error Message Parameters

The following table shows the message parameters used to format an error message for each configurable validation rule.

<table>
<tbody>
<tr>
  <th>Type</th>
  <th>Rule Name</th>
  <th>Index</th>
  <th>Value</th>
</tr>
<tr>
  <td rowSpan="12">Record Error</td>
  <td><code>malformed</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td><code>unidentified</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td rowSpan="2"><code>unexpected</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td rowSpan="4"><code>minLength</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Minimum Length</td>
</tr>
<tr>
  <td>3</td>
  <td>Maximum Length</td>
</tr>
<tr>
  <td rowSpan="4"><code>maxLength</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Minimum Length</td>
</tr>
<tr>
  <td>3</td>
  <td>Maximum Length</td>
</tr>
<tr>
  <td rowSpan="52">Field Error</td>
  <td rowSpan="4"><code>required</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td rowSpan="4"><code>nillable</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td rowSpan="6"><code>minLength</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td>Minimum Length</td>
</tr>
<tr>
  <td>5</td>
  <td>Maximum Length</td>
</tr>
<tr>
  <td rowSpan="6"><code>maxLength</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td>Minimum Length</td>
</tr>
<tr>
  <td>5</td>
  <td>Maximum Length</td>
</tr>
<tr>
  <td rowSpan="5"><code>length</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td>Fixed Length Field Length</td>
</tr>
<tr>
  <td rowSpan="5"><code>regex</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td>Regular Expression Pattern</td>
</tr>
<tr>
  <td rowSpan="5"><code>type</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td><code>TypeConversionException</code> error message.</td>
</tr>
<tr>
  <td rowSpan="5"><code>literal</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>Field Text</td>
</tr>
<tr>
  <td>4</td>
  <td>Literal value</td>
</tr>
<tr>
  <td rowSpan="6"><code>minOccurs</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field or Bean Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>-</td>
</tr>
<tr>
  <td>4</td>
  <td>Minimum occurrences</td>
</tr>
<tr>
  <td>5</td>
  <td>Maximum occurences</td>
</tr>
<tr>
  <td rowSpan="6"><code>maxOccurs</code></td>
  <td>0</td>
  <td>Line Number</td>
</tr>
<tr>
  <td>1</td>
  <td>Record Label/Name</td>
</tr>
<tr>
  <td>2</td>
  <td>Field or Bean Label/Name</td>
</tr>
<tr>
  <td>3</td>
  <td>-</td>
</tr>
<tr>
  <td>4</td>
  <td>Minimum occurrences</td>
</tr>
<tr>
  <td>5</td>
  <td>Maximum occurences</td>
</tr>
</tbody>
</table>

## Appendix C: Upgrading a 1.x Mapping File Example

This appendix illustrates typical changes required to update an 1.x mapping file to 2.x.

Given the following 1.x mapping file:

```xml
<beanio xmlns="http://www.beanio.org/2011/01"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://www.beanio.org/2011/01 http://www.beanio.org/2011/01/mapping.xsd">

	<stream name="employees" format="delimited">
		<reader>
			<property name="delimiter" value="," />
		</reader>
		<writer>
			<property name="delimiter" value="," />
		</writer>
		<record name="header" class="example.Header" maxOccurs="1">
			<field name="recordType" rid="true" literal="H" />
			<field name="fileDate" format="yyyy-MM-dd" />
		</record>
		<record name="employee" class="example.Employee" minOccurs="0" minLength="6" maxLength="7">
			<field name="recordType" rid="true" literal="D" />
			<field name="firstName" />
			<field name="lastName" />
			<bean name="address" class="example.Address" >
				<field name="city" />
				<field name="state" />
				<field name="zip" />
			</bean>
			<field name="phoneNumber" />
		</record>
		<record name="trailer" class="example.Trailer" maxOccurs="1">
			<field name="recordType" rid="true" literal="T" />
			<field name="recordCount" />
		</record>
	</stream>

	<stream name="contacts" format="xml" ordered="false">
		<record name="person" class="example.Person" minOccurs="0">
			<field name="firstName" />
			<field name="lastName" minOccurs="1" />
			<field name="phone" collection="list" minOccurs="0" maxOccurs="5" xmlWrapper="phoneList" />
		</record>
		<record name="company" class="example.Person" minOccurs="0">
			<field name="companyName" minOccurs="1" />
			<field name="phone" />
		</record>
	</stream>

</beanio>
```

The following 2.x mapping file can be created:

```xml
<!-- Namespace updated -->
<beanio xmlns="http://www.beanio.org/2012/03"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.beanio.org/2012/03 http://www.beanio.org/2012/03/mapping.xsd">

  <!-- Use 'strict' to have BeanIO calculate and enforce default record lengths and ordering -->
  <stream name="employees" format="delimited" strict="true">
    <!-- Combine 'reader' and 'writer' elements into 'parser' -->
    <parser>
      <property name="delimiter" value="," />
    </parser>
    <!-- 'minOccurs' defaults to 0 if not specified -->
    <record name="header" class="example.Header" minOccurs="1" maxOccurs="1">
      <field name="recordType" rid="true" literal="H" />
      <field name="fileDate" format="yyyy-MM-dd" />
    </record>
    <!-- 'minLength/maxLength' not needed, see 'phoneNumber' field below for explanation -->
    <record name="employee" class="example.Employee" minOccurs="0" minLength="6" maxLength="7">
      <field name="recordType" rid="true" literal="D" />
      <field name="firstName" />
      <field name="lastName" />
      <!-- Change 'bean' elements to 'segment' elements -->
      <segment name="address" class="example.Address" >
        <field name="city" />
        <field name="state" />
        <field name="zip" />
      </segment>
      <!-- Use 'minOccurs' to denote optional fields at the end of a record.  When used with
        -- 'strict', there is no need to set 'minLength' and 'maxLength' on the record, unless
        -- you are not mapping every field -->
      <field name="phoneNumber" minOccurs="0" />
    </record>
    <record name="trailer" class="example.Trailer" minOccurs="1" maxOccurs="1">
      <field name="recordType" rid="true" literal="T" />
      <field name="recordCount" />
    </record>
  </stream>

  <!-- Records are not ordered by default.  -->
  <stream name="contacts" format="xml" ordered="false">
    <!-- minOccurs defaults to 0 -->
    <record name="person" class="example.Person" minOccurs="0">
      <!-- Optional XML elements must set minOccurs to 0 -->
      <field name="firstName" minOccurs="0"/>
      <field name="lastName" minOccurs="1" />
      <!-- Use a 'segment' instead of an 'xmlWrapper' -->
      <segment name="phoneList" minOccurs="0">
        <field name="phone" collection="list" minOccurs="0" maxOccurs="5" xmlWrapper="phoneList" />
      </segment>
    </record>
    <record name="company" class="example.Person" minOccurs="0">
      <field name="companyName" minOccurs="1" />
      <!-- Optional XML elements must set minOccurs to 0 -->
      <field name="phone" minOccurs="0"/>
    </record>
  </stream>

</beanio>
```
