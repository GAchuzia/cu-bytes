import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: '#FFFFFF',
    padding: '0.5%' as any,

    alignItems: 'center',
    textAlign: 'center',

    width: '100%',

    overflowY: 'scroll'
  },
  
  title: {
    color: '#0a7ea4',
    backgroundColor: '#FFFFFFFF',
    padding: '1.5%' as any,

    textAlign: 'center',
    margin: '0.5%' as any,  
    
    fontFamily: 'sans-serif',
    fontSize: '300%' as any,
    fontWeight: 'bold',    
  },

  subtitle: {
    color: '#0a7ea4',
    backgroundColor: '#FFFFFF',
    padding: '0.5%' as any,

    textAlign: 'center',
    margin: '0.5%' as any,

    fontFamily: 'sans-serif',
    fontSize: '175%' as any,
    fontWeight: 'bold'
  },

  button: {
    color: 'black',
    backgroundColor: '#0a7ea4',
    padding: '0.5%' as any,

    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.2%' as any,

    borderRadius: 25,
    borderWidth: 4,
    borderBlockColor: 'black',
    
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    
    width: '80%' as any,
    height: '12.5%' as any
  },

  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },

  buttonText: {
    color: 'white',

    fontFamily: 'sans-serif',
    fontSize: '200%' as any,
    fontWeight: '800',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1%' as any,
    width: '85%',
  },

  label: {
    flex: 1,
    fontSize: '150%' as any,
    paddingRight: '1%' as any,
    flexWrap: 'wrap',
  },

  switchContainer: {
    width: '15%',
    alignItems: 'flex-end'
  },

  switch: {
    transform: [{ scale: 1.4 }],
  },

});
