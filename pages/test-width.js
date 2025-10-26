// PURE TEST PAGE - Zero dependencies
export default function TestWidth() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100%' }}>
      <div style={{
        width: '100%',
        height: '60px',
        backgroundColor: 'red',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        TEST 1: This should be 100% width
      </div>

      <div style={{
        width: '100vw',
        height: '60px',
        backgroundColor: 'blue',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        TEST 2: This uses 100vw
      </div>

      <div style={{
        backgroundColor: 'green',
        color: 'white',
        padding: '20px',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        TEST 3: No width specified (should default to 100%)
      </div>
    </div>
  );
}
