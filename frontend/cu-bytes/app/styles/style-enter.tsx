import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: '#FFFFFF',
    padding: '0.5%' as any,

    alignItems: 'center',

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
    flex: 1,

    color: 'black',
    backgroundColor: '#0a7ea4',
    padding: '0.5%' as any,
    
    textAlign: 'center',
    margin: '0.5%' as any,
    lineHeight: 40,

    fontFamily: 'sans-serif',
    fontSize: '175%' as any,
    fontWeight: 'bold',

    width: '100%'
  },

  description: {
    color: '#0000FF',
    backgroundColor: 'rgba(255, 210, 210, 1)',
    padding: '1.2%' as any,

    textAlign: 'center',
    marginBottom: '0.5%' as any,    

    fontFamily: 'sans-serif',
    fontSize: '100%' as any,
    fontWeight: '600',

    borderRadius: 40
  },
  
  button: {
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: '1.2%' as any,
    marginBottom: '1.2%' as any,
    elevation: 8,

    backgroundColor: '#FF6B6B',
    padding: '0.5%' as any,

    borderRadius: 30,
    borderWidth: 3,
    borderBlockColor: '#000000FF',
    
    shadowColor: '#000000FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    
    width: '50%'
  },
  buttonDisabled: {
    backgroundColor: '#cccccccc',
  },
  buttonText: {
    fontFamily: 'sans-serif',
    fontSize: '200%' as any,
    fontWeight: '800',

    color: 'white',
  },
  pressableText: {
    justifyContent: 'center',
    alignItems: 'center',

    textAlign: 'center',

    fontFamily: 'sans-serif',
    fontSize: '150%' as any,
    fontWeight: 600,

    color: '#000000FF',
    backgroundColor: 'rgba(230, 250, 250, 1)',
    padding: '1.6%' as any,
    paddingHorizontal: '2.4%' as any,
    borderRadius: 0,

    width: '100%'
  },
  infoSection: {
    backgroundColor: 'white',
    padding: '1.2%' as any,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: '100%' as any,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1%' as any,
  },
  infoText: {
    fontSize: '100%' as any,
    color: '#666',
    marginBottom: '1%' as any,
  },
  textInput: {
    fontSize: '150%' as any,
    fontFamily: 'Sans-Serif',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: '1%' as any,
    elevation: 8,

    backgroundColor: '#FFFFFF',
    paddingVertical: '1%' as any,
    paddingHorizontal: '1%' as any,

    borderRadius: 10,
    borderWidth: 2,
    borderBottomColor: '#000000FF',

    shadowColor: '#000000FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    
    width: '60%'
  }
});