import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {RenderContextProps, withRuntimeContext} from './RenderContext'

import ExtensionPoint from './ExtensionPoint'

type Element = string | ElementArray
interface ElementArray extends Array<Element> {}

interface LayoutContainerProps {
  aboveTheFold?: number
  elements: Element
}

interface ContainerProps {
  aboveTheFold?: number
  elements: Element
  isRow: boolean
  preview?: boolean
}

const elementPropType = PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired

class Container extends Component<ContainerProps> {
  public static propTypes = {
    aboveTheFold: PropTypes.number,
    elements: elementPropType,
    isRow: PropTypes.bool,
    preview: PropTypes.bool,
  }

  public render() {
    const { isRow, elements, children, ...props } = this.props

    const className = `flex flex-grow-1 w-100 ${isRow ? 'flex-row' : 'flex-column'}`
    if (typeof elements === 'string') {
      if (elements === '__children__') {
        return children
      }
      return (
        <div className={isRow ? '' : className}>
          <ExtensionPoint id={elements} {...props} />
        </div>
      )
    }

    let elementsToRender = this.props.elements.length
    if (this.props.preview && this.props.aboveTheFold != null) {
      elementsToRender = this.props.aboveTheFold
    }

    const returnValue: JSX.Element[] = elements.slice(0, elementsToRender).map((element: Element) => {
      return (
        <Container key={element.toString()} elements={element} isRow={!isRow} {...props}>
          {children}
        </Container>
      )
    })

    return (
      <div className={className}>
        {returnValue}
      </div>
    )
  }
}

// tslint:disable-next-line
class LayoutContainer extends Component<LayoutContainerProps & RenderContextProps> {
  public static propTypes = {
    aboveTheFold: PropTypes.number,
    elements: elementPropType,
  }

  public render() {
    const {runtime: {preview}} = this.props
    return <Container {...this.props} preview={preview} isRow={false} />
  }
}

export default withRuntimeContext(LayoutContainer)