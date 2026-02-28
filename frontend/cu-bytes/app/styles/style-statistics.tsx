import { StyleSheet } from "react-native";
import StatisticsScreen from "../statistics";

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center', // Horizontal
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start', // Vertical
    overflowY: 'scroll',
    textAlign: 'center',
    width: '100%' as any,
  },

  headerContainer: {
    backgroundColor: '#C5151A',
    width: '10%' as any,
  },

  bodyContainerDefault: {
    alignItems: 'center', // Horizontal
    backgroundColor: '#C5151A',
    width: '100%' as any,
  },

  bodyContainerAlt: {
    alignItems: 'center', // Horizontal
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'center', // Vertical
    width: '100%' as any,
  },

  statusbar: {
    alignItems: 'center', // Horizontal
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between', // Vertical
    padding: '1.5%' as any,
    textAlign: 'center',
    width: '100%' as any,
  },

  headerButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'black',
    color: 'red',
    padding: '1.5%' as any,
    width: '10%' as any,
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 500,
  },
  
  headerTitle: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '300%' as any,
    fontWeight: 800,
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: '50%' as any,
  },

  headerUsernameIcon: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '10%' as any,
  },

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 500,
    marginTop: '0.5%' as any,
    paddingTop: '5.0%' as any,
    paddingBottom: '5.0%' as any,
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: '100%' as any,
  },

  statisticsInfoText: {
    backgroundColor: '#FFFFFF',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: '150%' as any,
    fontWeight: 600,
    marginTop: '1.5%' as any,
    marginBottom: '1.5%' as any,
    paddingTop: '5.0%' as any,
    paddingBottom: '5.0%' as any,
    paddingLeft: '5.0%' as any,
    width: '40%' as any,
  },

  numberOfDaysText: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#131312',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: '300%' as any,
    fontWeight: 800,
    marginTop: '0.5%' as any,
    marginLeft: '5.0%' as any,
    marginRight: '5.0%' as any,
    paddingTop: '2.5%' as any,
    paddingBottom: '2.5%' as any,
    paddingLeft: '2.5%' as any,
    paddingRight: '2.5%' as any,
    textAlign: 'center',
    width: '20%' as any,
  },

  bodyButtonDefault: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#131312',
    marginTop: '2.5%' as any,
    padding: '2.5%' as any,
    width: '80%' as any,
  },

  bodyButtonTextDefault: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '175%' as any,
    fontWeight: 600,
    textAlign: 'center',
  },

  bodyButtonTextAlt: {
    backgroundColor: 'transparent',
    color: '#C5151A',
    fontFamily: 'arial',
    fontSize: '175%' as any,
    fontWeight: 600,
    textAlign: 'center',
  },

  bodyButtonIncreaseNumberOfDays: {
    alignItems: 'center',
    backgroundColor: '#697A37',
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#131312',
    marginTop: '2.5%' as any,
    marginBottom: '2.5%' as any,
    padding: '1.5%' as any,
    width: '25%' as any,
  },

  bodyButtonDecreaseNumberOfDays: {
    alignItems: 'center',
    backgroundColor: '#FFB4B4',
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#131312',
    marginTop: '2.5%' as any,
    marginBottom: '2.5%' as any,
    padding: '1.5%' as any,
    width: '25%' as any,
  },

  bodyButtonTextIncreaseNumberOfDays: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: '300%' as any,
    fontWeight: 800,
    textAlign: 'center',
  },
  
  bodyButtonTextDecreaseNumberOfDays: {
    backgroundColor: 'transparent',
    color: '#C5151A',
    fontFamily: 'arial',
    fontSize: '300%' as any,
    fontWeight: 800,
    textAlign: 'center',
  }

})