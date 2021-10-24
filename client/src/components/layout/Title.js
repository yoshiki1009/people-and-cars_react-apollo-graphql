import React from 'react'

const getStyles = () => ({
  title: {
    fontSize: 50,
    padding: '15px',
    marginBottom: '50px',
  },
})

const Title = () => {
  const styles = getStyles()

  return <h1 style={styles.title}>People and Their Cars</h1>
}

export default Title
