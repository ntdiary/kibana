/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

import { StyleTabs } from './style_tabs';
import { JoinEditor } from './join_editor';
import { FlyoutFooter } from './flyout_footer';

import {
  EuiHorizontalRule,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  EuiPanel,
  EuiFlexGroup,
} from '@elastic/eui';
import { ALayer } from '../../shared/layers/layer';
import _ from 'lodash';

export class LayerPanel  extends React.Component {

  constructor() {
    super();
    this.state = {
      displayName: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadDisplayName();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadDisplayName = async () => {
    const displayName = await this.props.selectedLayer.getDisplayName();
    if (this._isMounted) {
      this.setState({ displayName });
    }
  }

  _renderGlobalSettings() {
    if (!this.props.selectedLayer) {
      return null;
    }

    const layerSettings =  ALayer.renderGlobalSettings({
      label: this.props.selectedLayer.getLabel(),
      onLabelChange: (label) => {
        this.props.updateLabel(this.props.selectedLayer.getId(), label);
      },
      minZoom: this.props.selectedLayer.getMinZoom(),
      maxZoom: this.props.selectedLayer.getMaxZoom(),
      alphaValue: _.get(this.props.selectedLayer.getCurrentStyle(),
        '_descriptor.properties.alphaValue', 0.5),
      onMinZoomChange: (zoom) => {
        this.props.updateMinZoom(this.props.selectedLayer.getId(), zoom);
      },
      onMaxZoomChange: (zoom) => {
        this.props.updateMaxZoom(this.props.selectedLayer.getId(), zoom);
      },
      onAlphaValueChange:
        alphaValue => this.props.updateAlphaValue(
          this.props.selectedLayer.getId(), alphaValue
        )
    });

    const frags = (
      <EuiPanel>
        <EuiTitle size="xs"><h5>Layer settings</h5></EuiTitle>
        <EuiSpacer margin="m"/>
        {layerSettings}
      </EuiPanel>);

    return frags;

  }

  _renderJoinSection() {
    return this.props.selectedLayer.isJoinable() ?
      (
        <EuiPanel>
          <JoinEditor layer={this.props.selectedLayer}/>
        </EuiPanel>
      ) : null;
  }

  render() {
    const { selectedLayer } = this.props;
    if (!selectedLayer) {
      //todo: temp placeholder to bypass state-bug
      return (<div/>);
    }

    const globalLayerSettings = this._renderGlobalSettings();
    const joinSection = this._renderJoinSection();

    return (
      <EuiFlexGroup
        direction="column"
        gutterSize="none"
      >
        <EuiFlexItem grow={false} className="gisViewPanel__header">
          <EuiTitle size="s" className="gisViewPanel__title">
            <h1>
              {selectedLayer.getIcon()}
              {this.state.displayName}
            </h1>
          </EuiTitle>
          <EuiSpacer size="m"/>
          <EuiHorizontalRule margin="none"/>
        </EuiFlexItem>

        <EuiFlexItem className="gisViewPanel__body">
          {globalLayerSettings}
          {joinSection}
          <StyleTabs layer={selectedLayer}/>
          {selectedLayer.renderSourceDetails()}
        </EuiFlexItem>

        <EuiFlexItem grow={false} className="gisViewPanel__footer">
          <EuiHorizontalRule margin="none"/>
          <EuiSpacer size="m"/>
          <FlyoutFooter/>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}
