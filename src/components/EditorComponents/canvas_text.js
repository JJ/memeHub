
import React, {useEffect, useState, createRef} from 'react';
import {Text, Transformer} from 'react-konva'

function CvText(props) {

    const stageRef = props.stage
    const transRef = createRef()
    const textRef = createRef()

    const [selected, setSelected] = useState(false)
    const select = () => {
        setSelected(true)
        
    }
    const deselect = () => {setSelected(false)}

    useEffect(() => {
        //show transformer if selected
        if(selected){
            transRef.current.nodes([textRef.current])
        }
        //
    })

    //by default the transformer only changes the scale
    //in this case we don't want the text to reescale so this method
    //recalculates width and resets scale to change the real width
    //so the text doesn't get distorted
    const scaleReset = () => {
        let text = textRef.current

        console.log(text)
        console.log(text.width)
        console.log(text.scaleX)

        text.setAttrs({
            width: text.width() * text.scaleX(),
            scaleX: 1,
            height: text.height() * text.scaleY(),
            scaleY: 1
        })
    }

    const editText = () => {
        let text = textRef.current

        let editarea = document.createElement('textarea')
        document.body.appendChild(editarea)

        //Making editarea look like the konva text
        let stageBox = stageRef.current.container().getBoundingClientRect();
        editarea.value = text.getAttr('text')
        editarea.style.position = 'absolute'
        let abs_pos = text.getAbsolutePosition()
        editarea.style.top  = (stageBox.top + abs_pos.y) + 'px'
        editarea.style.left = (stageBox.left  + abs_pos.x) + 'px'
        editarea.style.width = text.width() + 'px'
        editarea.style.height = text.height() + 'px'
        editarea.style.background = 'none'
        /*let rotation = text.rotation()
        let rot_transformation = ''
        if( rotation ){ rot_transformation += 'rotateZ('+rotation+'deg)'}
        editarea.style.transform = rot_transformation*/
        //

        //Hide original text set focus on the editable area
        text.hide()
        editarea.focus()

        console.log("ancho" + text.width())

        console.log("EDITAREA")
        console.dir(editarea)
        
        console.log("TEXTO")
        console.log(text)

        editarea.addEventListener('focusout', (e) => {
            //apply changes, show text again(repaint), delete textarea
            text.setAttrs({text: editarea.value})
            text.show()
            stageRef.current.batchDraw()
            document.body.removeChild(editarea)
        } )
    }


    return(
      <React.Fragment>
        <Text
            ref={textRef}
            x={100}
            y={100}
            width={ props.fontSize * 32 }
            height={100}
            text={props.text}
            fontSize={props.fontSize}
            fontFamily={props.fontFamily}
            draggable={props.draggable}

            onTransform={scaleReset}

            onClick={select}

            onDblClick={editText}
            onDblTap={editText}
        />
        { selected ? 
            <Transformer
                ref={transRef}
                rotateEnabled={true}
                keepRatio={false}
            /> : null
         }
      </React.Fragment>
    );
}

export default CvText