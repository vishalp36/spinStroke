import React, { Component } from 'react'
import opentype from 'opentype.js'
import CSSModules from 'react-css-modules'

import Select from 'react-select'
import 'react-select/dist/react-select.css'

export default CSSModules(class FontSection extends Component {
    constructor (props) {
        super(props)
        this.uploadFont = this.uploadFont.bind(this)
        this.FontChangeHandler = this.FontChangeHandler.bind(this)
        this.StyleChangeHandler = this.StyleChangeHandler.bind(this)
        this.state = {
            options: [
                { value: 'Roboto', label: 'Roboto' }
            ],
            StyleOptions: [

            ],
            target: 'Roboto',
            StyleTarget: ''
        }
    }
    uploadFont (acceptedFiles, rejectedFiles) {
        console.log('Accepted & reject: ', acceptedFiles, rejectedFiles)
        opentype.load(acceptedFiles[0].preview, (err, font) => {
            if (err) {
                console.log('Could not load font: ' + err)
            } else {
                // Use font here.
                this.props.uploadFile(acceptedFiles[0].preview)
            }
        })
    }
    FontChangeHandler (val) {
        this.setState({target: val})
        this.props.getsFontStyle(val)
    }
    StyleChangeHandler (val) {
        this.setState({StyleTarget: val})
        this.props.uploadFile(val.url)
    }
    componentDidMount () {
        this.props.getsFont()
    }
    componentWillReceiveProps (nextProps) {
        // update selector
        let data = []
        nextProps.Font.AllFont.map((font) => data.push({ 'value': font.id, 'label': font.id }))
        this.setState({options: data})

        // update selector
        let style = []
        nextProps.Font.FontStyle.map((font) => style.push({
            'value': (font.fontStyle + ', ' + font.fontWeight),
            'label': (font.fontStyle + ', ' + font.fontWeight),
            'url': font.woff
        }))
        this.setState({StyleOptions: style})
    }
    render () {
        return (
            <section id="Font" className="main special">
                {/* <header className="major">
                    <h2>Step1. Upload Font</h2>
                    <p>Upload any kind of font you like<br />
                    or, use our sample font!</p>
                </header> */}
                <footer className="major">
                    <ul className="actions wordpicker">
                        <li>
                            <p>Pick a Font</p>
                            <Select
                                name="FontSelector"
                                value={this.state.target}
                                SelectSearchable="True"
                                options={this.state.options}
                                onChange={this.FontChangeHandler}
                            />
                        </li>
                        <li>
                            <p>select Font Style</p>
                            <Select
                                name="StyleSelector"
                                value={this.state.StyleTarget}
                                SelectSearchable="True"
                                options={this.state.StyleOptions}
                                onChange={this.StyleChangeHandler}
                            />
                        </li>
                    </ul>

                </footer>
            </section>
        )
    }
}, require('./FontSection.styl'))
