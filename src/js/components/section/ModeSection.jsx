import React, { Component } from 'react'
import opentype from 'opentype.js'
import CSSModules from 'react-css-modules'

import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import {Creatable} from 'react-select'
import 'react-select/dist/react-select.css'

export default CSSModules(class ModeSection extends Component {
    constructor (props) {
        super(props)
        // function
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeSize = this.handleChangeSize.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.InputChangeHandler = this.InputChangeHandler.bind(this)
        this.state = {
            ...props.File,
            ...props.Stroke,
            text: '',
            textArray: [
                { value: 'come', label: 'come' },
                { value: 'edit', label: 'edit' },
                { value: 'me', label: 'me' }
            ],
            multiValue: [],
            size: 300,
            FontSize: 500,
            AnimationSpeed: 50,
            ChangeRate: 50
        }
    }
    handleChange (event) {
        this.setState({text: event.target.value})
        // this.props.modifyText(event.target.value)
    }
    handleChangeSize (event) {
        this.setState({size: event.target.value})
    }
    InputChangeHandler (val) {
        console.log(val)
        this.setState({ multiValue: val })
    }
    handleSubmit () {
        this.props.modifyText(this.state.text)
        let uploadfont = this.props.File.File // 'https://fonts.gstatic.com/s/roboto/v15/i0Up8OwuR1OCkHxm4iiTTPesZW2xOQ-xsNqO47m55DA.woff'
        opentype.load(uploadfont, (err, font) => {
            if (err) {
                console.log('Could not load font: ' + err)
            } else {
                // Use font here.
                // let size = this.state.size
                let size = this.state.FontSize
                // let fontPaths = []
                let textList = this.state.multiValue.map((text) => (text.label))
                let HGlyths = textList.map((text) => (font.getPath(text, 500, 500, size)))
                let len = HGlyths.length
                console.log('glyth: ', HGlyths)

                // min/max for x,y
                let modList = []
                let minX = 21474851
                let maxX = 0
                let minY = minX
                let maxY = maxX

                // round1: get min/max for (x,y)
                for (let i = 0; i < len; i++) {
                    let HPath = HGlyths[i]
                    // let HPath = HGlyths[i].getPath(0, 0, size)
                    // console.log('[Path] this is Bound', HPath.getBoundingBox())
                    let B = HPath.getBoundingBox()
                    if (B.x1 < minX) minX = B.x1
                    if (B.x2 > maxX) maxX = B.x2
                    if (B.y1 < minY) minY = B.y1
                    if (B.y2 > maxY) maxY = B.y2
                    modList.push({x: B.x2 - B.x1, y: B.y2 - B.y1, minX: B.x1, minY: B.y1})
                }
                console.log('result: ', minX, maxX, minY, maxY, 'modList', modList)
                console.log('modify (x,y) ', Math.abs((maxX - minX) / 2), Math.abs((maxY - minY) / 2))
                // let modX = Math.abs((maxX - minX))
                // let modY = Math.abs((maxY - minY))
                this.props.modifyTextBound({ x: 1000, y: 500 })
                // this.props.modifyTextBound({ x: modX, y: modY })

                /*
                // round2: really put path in to array and write back.
                for (let i = 0; i < len; i++) {
                    let offsetX = ((modX - modList[i].x) / 2 - modList[i].minX)
                    let offsetY = ((modY - modList[i].y) / 2 - modList[i].minY)
                    let HPath = HGlyths[i].getPath(offsetX, offsetY, size)
                    fontPaths.push(HPath.toPathData(2))
                    // this.props.addSymbol(HPath.toPathData(2))
                }
                */
                let fontPaths = HGlyths.map((HPath) => {
                    return HPath.toPathData(2)
                })
                this.props.setStrokeProps({symbols: fontPaths})
                // console.log('final path', fontPaths)
            }
        })
    }
    render () {
        return (
            <section id="Mode" className="main special">
                {/* <header className="major">
                    <h2>Step3. Input Text</h2>
                    <p>type any word in your mind<br />
                    and ready for the magic!</p>
                </header> */}
                <ul className="actions">
                </ul>
                <ul className="actions slideControll">
                    <li>
                        <p>Input:</p>
                        <Creatable
                            multi={true}
                            options={this.state.textArray}
                            onChange={this.InputChangeHandler}
                            value={this.state.multiValue}
                        />
                    </li>
                    <li>
                        <p>FontSize:</p>
                        <InputRange
                          maxValue={1000}
                          minValue={100}
                          step={10}
                          value={this.state.FontSize}
                          onChange={FontSize => this.setState({FontSize: FontSize})} />
                    </li>
                    <li>
                        <p>Animation Speed:</p>
                        <InputRange
                          maxValue={100}
                          minValue={10}
                          step={10}
                          value={this.state.AnimationSpeed}
                          onChange={AnimationSpeed => this.setState({AnimationSpeed: AnimationSpeed})} />
                    </li>
                    <li>
                        <p>Change Rate:</p>
                        <InputRange
                          maxValue={100}
                          minValue={10}
                          step={10}
                          value={this.state.ChangeRate}
                          onChange={ChangeRate => this.setState({ChangeRate: ChangeRate})} />
                    </li>
                </ul>
                <ul className="actions">
                    <li onClick={this.handleSubmit}><a className="button special">update</a></li>
                </ul>
            </section>
        )
    }
}, require('./ModeSection.styl'))
