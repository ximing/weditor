/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import React, { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Select } from '../ui/Select'

function Harness(props: { onChange: (v: string) => void }) {
  const [value, setValue] = useState('a')
  return (
    <Select
      label="Fruit"
      value={value}
      options={[
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' },
      ]}
      onChange={(v) => {
        setValue(v)
        props.onChange(v)
      }}
    />
  )
}

afterEach(() => cleanup())

describe('Select', () => {
  it('opens a listbox and selects an option', async () => {
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = render(<Harness onChange={onChange} />)
    const trigger = getByLabelText('Fruit')
    expect(trigger.textContent).toContain('Apple')
    fireEvent.click(trigger)
    const listbox = await waitFor(() => getByRole('listbox'))
    const banana = getByRole('option', { name: 'Banana' })
    expect(banana.getAttribute('aria-selected')).toBe('false')
    fireEvent.click(banana)
    expect(onChange).toHaveBeenCalledWith('b')
    expect(trigger.textContent).toContain('Banana')
    await waitFor(() => expect(document.querySelector('[role=listbox]')).toBeNull())
    void listbox
  })

  it('closes on Escape', async () => {
    const { getByLabelText, getByRole } = render(<Harness onChange={() => {}} />)
    fireEvent.click(getByLabelText('Fruit'))
    const listbox = await waitFor(() => getByRole('listbox'))
    fireEvent.keyDown(listbox, { key: 'Escape' })
    await waitFor(() => expect(document.querySelector('[role=listbox]')).toBeNull())
  })
})
