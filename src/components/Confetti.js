/* eslint-env browser */

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import confetti from 'canvas-confetti'
import classNames from 'classnames'

const Confetti = ({ trigger, delay, duration }) => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    ticks: 1000,
  }

  const [isHidden, setIsHidden] = useState(true)
  const [isIE10, setIsIE10] = useState(true)
  const canvas = useRef(null)

  const create = useMemo(
    () => (canvas.current
      ? confetti.create(canvas.current, { resize: true })
      : null
    ),
    [canvas.current],
  )

  const fire = useCallback(
    (particleRatio, opts) => {
      create({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    },
    [create],
  )

  useEffect(() => {
    if (trigger) {
      setIsHidden(false)
      setTimeout(() => {
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        })
        fire(0.2, {
          spread: 60,
        })
        fire(0.35, {
          spread: 100,
          decay: 0.91,
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
        })
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        })
        setTimeout(() => {
          setIsHidden(true)
        }, duration)
      }, delay)
    }
  }, [trigger])

  useEffect(() => {
    if (canvas.current) {
      setIsIE10(window.navigator.userAgent.indexOf('MSIE 10') > -1)
    }
  }, [canvas.current])

  return (
    <canvas
      className={classNames(
        'confetti-canvas',
        { 'confetti-canvas--hidden': isHidden },
        { 'confetti-canvas--background': isIE10 },
      )}
      ref={canvas}
    />
  )
}

Confetti.defaultProps = {
  delay: 0,
  duration: 8000,
}

Confetti.propTypes = {
  trigger: PropTypes.bool.isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
}

export default Confetti
