import { StyleSheet } from "react-native";
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'scroll',
    textAlign: 'center',
    width: w(100),
  },

  headerContainer: {
    backgroundColor: '#C5151A',
    width: w(10),
  },

  bodyContainerDefault: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    width: w(100),
  },

  bodyContainerAlt: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'center',
    width: w(100),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: w(1.5),
    textAlign: 'center',
    width: w(100),
  },

  headerButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'black',
    color: 'red',
    padding: w(1.5),
    width: w(10),
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '500',
  },

  headerTitle: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(300),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(50),
  },

  headerUsernameIcon: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: 'bold',
    textAlign: 'center',
    width: w(10),
  },

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '500',
    marginTop: h(0.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

  statisticsInfoText: {
    backgroundColor: '#FFFFFF',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '600',
    marginTop: h(1.5),
    marginBottom: h(1.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    paddingLeft: w(5),
    width: w(40),
  },

  numberOfDaysText: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#131312',
    color: '#131312',
    fontFamily: 'arial',
    fontSize: font(300),
    fontWeight: '800',
    marginTop: h(0.5),
    marginLeft: w(5),
    marginRight: w(5),
    paddingTop: h(2.5),
    paddingBottom: h(2.5),
    paddingLeft: w(2.5),
    paddingRight: w(2.5),
    textAlign: 'center',
    width: w(20),
  },

  bodyButtonDefault: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#131312',
    marginTop: h(2.5),
    padding: h(2.5),
    width: w(80),
  },

  bodyButtonTextDefault: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    textAlign: 'center',
  },

  bodyButtonIncreaseNumberOfDays: {
    alignItems: 'center',
    backgroundColor: '#697A37',
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#131312',
    marginTop: h(2.5),
    marginBottom: h(2.5),
    padding: w(1.5),
    width: w(25),
  },

  bodyButtonDecreaseNumberOfDays: {
    alignItems: 'center',
    backgroundColor: '#FFB4B4',
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '#131312',
    marginTop: h(2.5),
    marginBottom: h(2.5),
    padding: w(1.5),
    width: w(25),
  },

  bodyButtonTextIncreaseNumberOfDays: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(300),
    fontWeight: '800',
    textAlign: 'center',
  },

  bodyButtonTextDecreaseNumberOfDays: {
    backgroundColor: 'transparent',
    color: '#C5151A',
    fontFamily: 'arial',
    fontSize: font(300),
    fontWeight: '800',
    textAlign: 'center',
  },

});
