import React, {Component,Fragment} from 'react';
import ColorPicker from './colorPicker'
import AlmanacGraphWrapped from "../AlmanacGraph/AlmanacGraph";
import rmpData from "../CoursePane/RMP.json";
import locations from "../CoursePane/locations.json";

import POPOVER from "../CoursePane/PopOver";

const styles = {
  container: {
    marginTop: 100
  }
}
class TabularView extends Component {

  redirectRMP = (e, name) => {
    if (!e)  e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    var lastName = name.substring(0, name.indexOf(","));
    var nameP = rmpData[0][name];
    if (nameP !== undefined)
      window.open("https://www.ratemyprofessors.com" + nameP);
    else
      window.open(
        `https://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+california+irvine&queryoption=HEADER&query=${lastName}&facetSearch=true`
      );
  };

  linkRMP = name => {
    const rmpStyle = {
      textDecoration: "underline",
      color: "#0645AD",
      cursor: "pointer"
    };
    return name.map(item => {
      if (item !== "STAFF") {
        return (
          <div
            style={rmpStyle}
            onClick={e => {
              this.redirectRMP(e, item);
            }}
          >
            {item}
          </div>
        );
      } else return item;
    });
  };

  genMapLink = location => {
    try {
      var location_id = locations[location.split(" ")[0]];
      return "https://map.uci.edu/?id=463#!m/"+location_id;
    } catch (err) {
      return "https://map.uci.edu/?id=463#!ct/12035,12033,11888,0,12034";
    }
  };
  render() {    
    const events = this.props.classEventsInCalendar;

    let result =[];

    for(let item of events)
      if(!item.isCustomEvent&& undefined === result.find(function(element){return element.courseCode===item.courseCode;}))
        result.push(item);
  
        let foundIndex =0;
        let classes =[];

    for( let course of result)
    {
      foundIndex = classes.findIndex(function(element){
             return ( course.name.join() === element.name.join()&& element.courseTerm ===course.courseTerm);
          });

             if(foundIndex === -1)
         {
          classes.push({
             name : course.name,
             lecAndDis :[course],
            //  courseID:event.courseID,
              courseTerm :course.courseTerm
           }
           );
         }
         else
            classes[foundIndex].lecAndDis.push(course);
      }

    
    return (
      <Fragment>
    {classes.map(event=>{
  return (<div>  <div
    style={{
      display: "inline-flex",
      marginTop:10
    }}
  >
    <POPOVER
      name={  event.name[0] + " " + event.name[1] + " | " + event.name[2]
    }
      courseDetails={event}
    />
       <AlmanacGraphWrapped
            term={event.courseTerm}
            courseDetails={event}
          />
    {/* <Typography variant="title" style={{ flexGrow: "2", marginTop: 12 }}>
      {this.props.name} &nbsp;&nbsp;&nbsp;&nbsp;
    </Typography> */}
    {/* <AlmanacGraphWrapped
      term={this.props.term}
      courseDetails={this.props.courseDetails}
    /> */}
  </div>
  <table>
        <thead>
        <tr>
          <th>Color</th>
          <th>Code</th>
          <th>Type</th>
          <th>Instructor</th>
          <th>Time</th>
          <th>Place</th>
          <th>Enrollmt</th>
          <th>Rstr</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>{
    event.lecAndDis.map(
     item =>{
       const secEach = item.section;
return (
  <tr>
  <ColorPicker  colorChange={this.props.colorChange} event ={item} />
          <td>{secEach.classCode}</td>
          <td className="multiline">
            {`${secEach.classType}
Sec ${secEach.sectionCode}
${secEach.units} units`}
          </td>
          <td className="multiline">
          {this.linkRMP(secEach.instructors)}
          </td>
          <td className="multiline">
            {secEach.meetings.map(meeting => meeting[0]).join("\n")}
          </td>
          <td className="multiline">
          {secEach.meetings.map(meeting => {
              return (meeting[1] !== "ON LINE") ? (
                <div>
                  <a href={this.genMapLink(meeting[1])} target="_blank">
                    {meeting[1]}
                  </a>
                  <br />
                </div>
              ) : (
                meeting[1]
              );
            })}
          </td>
          <td className={["multiline", secEach.status].join(" ")}>
            {`${secEach.numCurrentlyEnrolled[0]} / ${secEach.maxCapacity}
WL: ${secEach.numOnWaitlist}
NOR: ${secEach.numNewOnlyReserved}`}
          </td>
          <td>
            <a
              href="https://www.reg.uci.edu/enrollment/restrict_codes.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              {secEach.restrictions}
            </a>
          </td>
          <td className={secEach.status}>{secEach.status}</td>
        </tr>
);
     }
    )
  }</tbody> </table></div>);
})}
      {/* <table>
        <thead>
        <tr>
          <th>Color</th>
          <th>Code</th>
          <th>Type</th>
          <th>Instructor</th>
          <th>Time</th>
          <th>Place</th>
          <th>Enrollmt</th>
          <th>Rstr</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {result.map(event => {
          if (!event.isCustomEvent) {
            const section = event.section;
            return (
              <tr>
        <ColorPicker  colorChange={this.props.colorChange} event ={event} />
                <td>{section.classCode}</td>
                <td className="multiline">
                  {`${section.classType}
Sec ${section.sectionCode}
${section.units} units`}
                </td>
                <td className="multiline">
                  {section.instructors.join("\n")}
                </td>
                <td className="multiline">
                  {section.meetings.map(meeting => meeting[0]).join("\n")}
                </td>
                <td className="multiline">
                  {section.meetings.map(meeting => meeting[1]).join("\n")}
                </td>
                <td className={["multiline", section.status].join(" ")}>
                  {`${section.numCurrentlyEnrolled[0]} / ${section.maxCapacity}
WL: ${section.numOnWaitlist}
NOR: ${section.numNewOnlyReserved}`}
                </td>
                <td>
                  <a
                    href="https://www.reg.uci.edu/enrollment/restrict_codes.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {section.restrictions}
                  </a>
                </td>
                <td className={section.status}>{section.status}</td>
              </tr>
            );
          }
        })}
        </tbody>
      </table> */}
      </Fragment>
    );
  }
}

export default TabularView;