//@ts-nocheck
import React, { useEffect, useState } from 'react'
import TeacherImg from '../../img/teacher_sub.svg'
import StarterImg from '../../img/starter_sub.svg'
import EntrepriseImg from '../../img/entreprise_sub.svg'
import { toast } from 'react-toastify'
import { Button, Typography, Chip, Divider } from '@mui/material'
import { CheckRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import getUser from '../../hooks/getUser'
import banner from '../../img/plansBanner.svg'
import Wave from '../../img/WhiteBigStripe.svg'
import useTranslations from '../../hooks/useTranslations'
import axios from 'axios'
import config from '../../config.json'

export default function Plans() {
  const user = getUser()
  const plan = useSelector((state) => state.plan)
  const customerId = useSelector((state) => state.customerId)
  // eslint-disable-next-line
  const translations = useTranslations()

  const openCustomerPortal = async () => {
    if (customerId == undefined) {
      toast.info(translations.alerts.buyplanseeinfo)
      return
    }

    const res = await axios.post(
      `${config['api-server']}/create-customer-portal-session`,
      { customerId: customerId }
    )

    const { redirectUrl } = res.data

    if (redirectUrl === null) {
      toast.info(translations.alerts.buyplanseeinfo)
      return
    }

    window.location = redirectUrl

    if (res.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(res.error.message)
    } else {
      //
    }
  }

  const selectClassroomPlan = async () => {
    if (!user) {
      toast.info(translations.alerts.loginfirst)
      return
    }
    if (plan == 'Starter') {
      //window.location = `/subscription/classroom`

      const res = await axios.post(
        `${config['api-server']}/create-checkout-session`,
        {
          email: user?.profileObj?.email,
          id: user?.profileObj?.googleId,
          plan: 'Classroom',
        }
      )
      console.log(res)
      window.location = res.data.url || '/'
    } else if (plan == 'Enterprise') {
      openCustomerPortal()
    } else {
      toast.info(translations.alerts.alreadyhaveplan)
    }
  }

  const selectEnterprisePlan = async () => {
    if (!user) {
      toast.info(translations.alerts.loginfirst)
      return
    }
    if (plan == 'Starter') {
      //window.location = `/subscription/entreprise`
      const res = await axios.post(
        `${config['api-server']}/create-checkout-session`,
        {
          email: user?.profileObj?.email,
          id: user?.profileObj?.googleId,
          plan: 'Enterprise',
        }
      )
      console.log(res)
      window.location = res.data.url || '/'
    } else if (plan == 'Classroom') {
      openCustomerPortal()
    } else {
      toast.info(translations.alerts.alreadyhaveplan)
    }
  }

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: 'auto',
          minHeight: '350px',
          display: 'flex',
          backgroundColor: 'white',
          padding: '10px',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div>
            <Typography
              variant="h3"
              style={{
                marginBottom: '20px',
                marginTop: '50px',
                fontWeight: 'bold',
                textAlign: 'left',
                maxWidth: '600px',
              }}
            >
              {translations.plans.title1}{' '}
              <b
                style={{
                  fontWeight: 'bold',
                  color: '#6c63ff',
                  marginBottom: '15px',
                }}
              >
                {translations.plans.title2}
              </b>{' '}
              {translations.plans.title3}
            </Typography>
          </div>
          <div />
        </div>
        <div>
          <img
            src={banner}
            alt="banner"
            style={{
              maxWidth: '400px',
              maxHeight: '400px',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
      <img
        src={Wave}
        alt="wave"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <div className="planDiv">
        <div id="plan1">
          <Typography
            variant="h3"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            color="#6c63ff"
          >
            <b>{translations.plans.starter.title}</b>
          </Typography>
          <Divider />
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <img
              alt="starter-img"
              height="220px"
              width="220px"
              src={StarterImg}
            />
          </div>
          <Typography variant="h5" color="#4F5251">
            {translations.plans.starter.at} <br />{' '}
            <span style={{ color: '#6c63ff', fontSize: '1.8em' }}>
              {translations.plans.starter.price}
            </span>
            <br />
            {translations.plans.starter.permonth}
          </Typography>
          <br />
          <Typography variant="sub1" color="#4F5251">
            {translations.plans.starter.sub}
          </Typography>
          <br />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '30px',
            }}
          >
            <Button
              className="sub-button"
              style={{ paddingLeft: '35px', paddingRight: '35px' }}
              variant={plan == 'Starter' ? 'outlined' : 'contained'}
              color="action"
              size="large"
              onClick={() => {
                plan == 'Starter'
                  ? toast.info(translations.alerts.alreadyhaveplan)
                  : toast.info(translations.alerts.betterplan)
              }}
            >
              {plan === 'Starter'
                ? translations.plans.classroom.buttonsubscribed
                : translations.plans.classroom.button}
            </Button>
          </div>
          <div>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.starter.features.feature1}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.starter.features.feature2}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.starter.features.feature3}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.starter.features.feature4}
            </Typography>
          </div>
        </div>
        <div>
          <div id="plan2">
            <div
              style={{
                width: 'fit-content',
                backgroundColor: '#1BB978',
                padding: '10px',
                marginTop: '-50px',
                borderRadius: '50px',
                marginLeft: '55px',
              }}
            >
              <Typography variant="h6" style={{ color: 'white' }}>
                {translations.plans.classroom.bestvalue}
              </Typography>
            </div>
            <Typography
              variant="h3"
              style={{ marginTop: '20px', marginBottom: '20px' }}
              color="#6c63ff"
            >
              <b>{translations.plans.classroom.title}</b>
            </Typography>
            <Divider />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <img
                alt="classroom-img"
                height="220px"
                width="220px"
                src={TeacherImg}
              />
            </div>
            <Typography variant="h5" color="#4F5251">
              {translations.plans.classroom.at} <br />{' '}
              <span style={{ color: '#6c63ff', fontSize: '1.8em' }}>
                {translations.plans.classroom.price}
              </span>
              <br />
              {translations.plans.classroom.permonth}
            </Typography>
            <br />
            <Typography variant="sub1" color="#4F5251">
              {translations.plans.classroom.sub}
            </Typography>
            <br />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '30px',
              }}
            >
              <Button
                id="Classroom"
                className="sub-button"
                style={{ paddingLeft: '35px', paddingRight: '35px' }}
                variant={plan === 'Classroom' ? 'outlined' : 'contained'}
                color="action"
                size="large"
                onClick={() => selectClassroomPlan()}
              >
                {plan === 'Classroom'
                  ? translations.plans.classroom.buttonsubscribed
                  : translations.plans.classroom.button}
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'start',
              }}
            >
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature1}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature2}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature3}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature4}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature5}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature6}
              </Typography>
              <Typography variant="subtitle1" className="features">
                {'✅ '}
                {translations.plans.classroom.features.feature7}
              </Typography>
            </div>
          </div>
        </div>
        <div id="plan3">
          <Typography
            variant="h3"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            color="#6c63ff"
          >
            <b>{translations.plans.entreprise.title}</b>
          </Typography>
          <Divider />
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <img
              alt="entreprise-img"
              height="220px"
              width="220px"
              src={EntrepriseImg}
            />
          </div>

          <Typography variant="h5" color="#4F5251">
            {translations.plans.entreprise.at} <br />{' '}
            <span style={{ color: '#6c63ff', fontSize: '1.8em' }}>
              {translations.plans.entreprise.price}
            </span>
            <br />
            {translations.plans.entreprise.permonth}
          </Typography>
          <br />

          <Typography variant="sub1" color="#4F5251">
            {translations.plans.entreprise.sub}
          </Typography>
          <br />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '30px',
            }}
          >
            <Button
              className="sub-button"
              style={{ paddingLeft: '35px', paddingRight: '35px' }}
              variant={plan === 'Enterprise' ? 'outlined' : 'contained'}
              color="action"
              size="large"
              onClick={() => selectEnterprisePlan()}
            >
              {plan === 'Enterprise'
                ? translations.plans.entreprise.buttonsubscribed
                : translations.plans.entreprise.button}
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'start',
            }}
          >
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature1}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature2}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature3}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature4}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature5}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature6}
            </Typography>
            <Typography variant="subtitle1" className="features">
              {'✅ '}
              {translations.plans.entreprise.features.feature7}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}
