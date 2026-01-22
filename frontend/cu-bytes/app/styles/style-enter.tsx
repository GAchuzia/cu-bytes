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

  subsubtitle: {
    color: 'black',
    backgroundColor: '#a1e7ff',
    padding: '0.5%' as any,
    
    textAlign: 'center',
    margin: '0.5%' as any,
    lineHeight: 50,

    fontFamily: 'sans-serif',
    fontSize: '175%' as any,
    fontWeight: 'bold',

    width: '100%' as any
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

  buttonPopup: {
    color: 'black',
    backgroundColor: '#0a7ea4',
    padding: '0.5%' as any,

    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%' as any,

    borderRadius: 25,
    borderWidth: 4,
    borderBlockColor: 'black',
    
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    
    width: '100%' as any,
    height: '40%' as any
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

  pressableText: {
    color: 'black',
    backgroundColor: '#a1e7ff',
    padding: '1.5%' as any,

    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 50,

    fontFamily: 'sans-serif',
    fontSize: '175%' as any,
    fontWeight: '600',

    borderRadius: 0,

    width: '100%' as any
  },
  
  textInput: {
    backgroundColor: '#FFFFFF',
    padding: '0.5%' as any,

    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.2%' as any,

    fontSize: '150%' as any,
    fontFamily: 'Sans-Serif',   
    
    borderRadius: 0,
    borderWidth: 2.5,
    borderBlockColor: 'black',

    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    
    width: '80%' as any,
    height: '10%' as any
  },

});