/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"
import { withTheme } from "@emotion/react"
import { Radio as UIRadio, RadioGroup, ALIGN } from "baseui/radio"
import {
  WidgetLabel,
  StyledWidgetLabelHelpInline,
} from "@streamlit/lib/src/components/widgets/BaseWidget"
import TooltipIcon from "@streamlit/lib/src/components/shared/TooltipIcon"
import { LabelVisibilityOptions } from "@streamlit/lib/src/util/utils"
import { Placement } from "@streamlit/lib/src/components/shared/Tooltip"
import { EmotionTheme } from "@streamlit/lib/src/theme"
import StreamlitMarkdown from "@streamlit/lib/src/components/shared/StreamlitMarkdown/StreamlitMarkdown"

export interface Props {
  disabled: boolean
  horizontal: boolean
  theme: EmotionTheme
  width?: number
  value: number | null
  onChange: (selectedIndex: number) => any
  options: any[]
  captions: any[]
  label?: string
  labelVisibility?: LabelVisibilityOptions
  help?: string
}

interface State {
  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: number | null
}

class Radio extends React.PureComponent<Props, State> {
  public state: State = {
    value: this.props.value ?? null,
  }

  public componentDidUpdate(prevProps: Props): void {
    // If props.value has changed, re-initialize state.value.
    if (
      prevProps.value !== this.props.value &&
      this.props.value !== this.state.value
    ) {
      this.setState((_, prevProps) => {
        return { value: prevProps.value ?? null }
      })
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedIndex = parseInt(e.target.value, 10)
    this.setState({ value: selectedIndex }, () =>
      this.props.onChange(selectedIndex)
    )
  }

  public render(): React.ReactNode {
    const { theme, width, help, label, horizontal, labelVisibility } =
      this.props
    let { disabled } = this.props
    const { colors, radii } = theme
    const style = { width }
    const options = [...this.props.options]
    const captions = [...this.props.captions]
    const hasCaptions = captions.length > 0

    const spacerNeeded = (caption: string): string => {
      // When captions are provided for only some options in horizontal
      // layout we need to add a spacer for the options without captions
      const spacer = caption == "" && horizontal && hasCaptions
      return spacer ? "&nbsp;" : caption
    }

    if (options.length === 0) {
      options.push("No options to select.")
      disabled = true
    }

    return (
      <div className="row-widget stRadio" data-testid="stRadio" style={style}>
        <WidgetLabel
          label={label}
          disabled={disabled}
          labelVisibility={labelVisibility}
        >
          {help && (
            <StyledWidgetLabelHelpInline>
              <TooltipIcon content={help} placement={Placement.TOP_RIGHT} />
            </StyledWidgetLabelHelpInline>
          )}
        </WidgetLabel>
        <RadioGroup
          onChange={this.onChange}
          value={
            this.state.value !== null ? this.state.value.toString() : undefined
          }
          disabled={disabled}
          align={horizontal ? ALIGN.horizontal : ALIGN.vertical}
          aria-label={label}
          data-testid="stRadioGroup"
          overrides={{
            RadioGroupRoot: {
              style: {
                gap: hasCaptions ? "0.5rem" : "0",
              },
            },
          }}
        >
          {options.map((option: string, index: number) => (
            <UIRadio
              key={index}
              value={index.toString()}
              overrides={{
                Root: {
                  style: ({
                    $isFocusVisible,
                  }: {
                    $isFocusVisible: boolean
                  }) => ({
                    marginBottom: 0,
                    marginTop: 0,
                    marginRight: hasCaptions ? "0.5rem" : "1rem",
                    // Make left and right padding look the same visually.
                    paddingLeft: 0,
                    alignItems: "start",
                    paddingRight: "2px",
                    backgroundColor: $isFocusVisible
                      ? colors.darkenedBgMix25
                      : "",
                    borderTopLeftRadius: radii.md,
                    borderTopRightRadius: radii.md,
                    borderBottomLeftRadius: radii.md,
                    borderBottomRightRadius: radii.md,
                  }),
                },
                RadioMarkOuter: {
                  style: ({ $checked }: { $checked: boolean }) => ({
                    width: "1rem",
                    height: "1rem",
                    marginTop: "0.35rem",
                    marginRight: "0",
                    backgroundColor:
                      $checked && !disabled
                        ? colors.primary
                        : colors.fadedText40,
                  }),
                },
                RadioMarkInner: {
                  style: ({ $checked }: { $checked: boolean }) => ({
                    height: $checked ? "6px" : "14px",
                    width: $checked ? "6px" : "14px",
                  }),
                },
                Label: {
                  style: {
                    color: disabled ? colors.fadedText40 : colors.bodyText,
                    position: "relative",
                    top: "1px",
                  },
                },
              }}
            >
              <StreamlitMarkdown
                source={option}
                allowHTML={false}
                isLabel
                largerLabel
              />
              {hasCaptions && (
                <StreamlitMarkdown
                  source={spacerNeeded(captions[index])}
                  allowHTML={false}
                  isCaption
                  isLabel
                />
              )}
            </UIRadio>
          ))}
        </RadioGroup>
      </div>
    )
  }
}

export default withTheme(Radio)
